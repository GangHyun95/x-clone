import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { pool } from '../lib/db.ts';
import { sendVerificationEmail } from '../lib/email.ts';
import { redis } from '../lib/redis.ts';
import { buildUserResponse, generateToken, generateVerificationCode } from '../lib/util.ts';

// signup, login, logout
export const signup = async (req: Request, res: Response): Promise<void> => {
    const { email, fullName, nickname, password } = req.body;

    const errors: { field: string; message: string }[] = [];
    if (!email) errors.push({ field: 'root', message: '이메일이 확인되지 않았습니다. 처음부터 다시 시도해 주세요.' });
    if (!fullName) errors.push({ field: 'root', message: '이름이 확인되지 않았습니다. 처음부터 다시 시도해 주세요.' });
    if (!nickname) errors.push({ field: 'nickname', message: '닉네임을 입력해 주세요.' });
    if (!password) errors.push({ field: 'password', message: '비밀번호를 입력해 주세요.' });
    if (password && password.length < 6) errors.push({ field: 'password', message: '비밀번호는 최소 6자 이상이어야 합니다.' });

    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '회원가입에 실패했습니다.', errors });
        return;
    }

    try {
        const isVerified = await redis.get(`email_verified:${email}`);
        if (!isVerified) {
            res.status(400).json({
                success: false,
                message: '이메일 인증이 필요합니다.',
                errors: [{ field: 'root', message: '이메일 인증이 필요합니다.' }],
            });
            return;
        }

        const nicknameCheck = await pool.query('SELECT 1 FROM users WHERE nickname = $1', [nickname]);
        if (nicknameCheck.rows.length > 0) {
            res.status(400).json({
                success: false,
                message: '이미 사용 중인 닉네임입니다.',
                errors: [{ field: 'nickname', message: '이미 사용 중인 닉네임입니다.' }],
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const insertResult = await pool.query(
            `INSERT INTO users (email, full_name, nickname, password) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
            [email, fullName, nickname, hashedPassword]
        );

        const newUser = insertResult.rows[0];
        const accessToken = generateToken(newUser.id.toString(), 'access');
        const refreshToken = generateToken(newUser.id.toString(), 'refresh');

        res.cookie('x_clone_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: '회원가입이 완료되었습니다.',
            data: {
                user: buildUserResponse(newUser),
                accessToken,
            },
        });

        await redis.del(`email_verified:${email}`);
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const errors: { field: string; message: string }[] = [];
    if (!email) errors.push({ field: 'root', message: '이메일을 입력해 주세요.' });
    if (!password) errors.push({ field: 'password', message: '비밀번호를 입력해 주세요.' });

    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '로그인에 실패했습니다.', errors });
        return;
    }

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user || !user.password) {
            res.status(401).json({
                success: false,
                errors: [
                    { field: 'root', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                    { field: 'password', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                ]
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
                errors: [
                    { field: 'root', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                    { field: 'password', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                ]
            });
            return;
        }

        const accessToken = generateToken(user.id.toString(), 'access');
        const refreshToken = generateToken(user.id.toString(), 'refresh');

        res.cookie('x_clone_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: '로그인에 성공했습니다.',
            data: {
                user: buildUserResponse(user),
                accessToken,
            }
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('x_clone_refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.status(200).json({
            success: true,
            message: '성공적으로 로그아웃되었습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

// token
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies.x_clone_refresh_token;
        if (!refreshToken) {
            res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
            return;
        }

        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) throw new Error('Refresh token secret is not defined');

        const decoded = jwt.verify(refreshToken, secret);
        if (typeof decoded !== 'object' || !('id' in decoded)) {
            res.status(403).json({ success: false, message: 'Refresh Token이 유효하지 않습니다.' });
            return;
        }

        const userResult = await pool.query(
            'SELECT id, email, full_name, nickname, profile_img, last_password_change FROM users WHERE id = $1',
            [decoded.id]
        );
        const user = userResult.rows[0];

        if (!user) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        const tokenIssuedAt = (decoded.iat as number) * 1000;
        const lastChanged = user.last_password_change ? Math.floor(user.last_password_change.getTime() / 1000) : 0;

        if (tokenIssuedAt <= lastChanged) {
            res.status(401).json({
                success: false,
                message: '비밀번호가 변경되어 토큰이 만료되었습니다. 다시 로그인해 주세요.',
            });
            return;
        }

        const newAccessToken = generateToken(user.id.toString(), 'access');
        res.status(200).json({
            success: true,
            message: 'Access token이 갱신되었습니다.',
            data: {
                accessToken: newAccessToken,
                user: buildUserResponse(user),
            },
        });
    } catch (error) {
        console.error('Access Token 갱신 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

// social login
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({ success: false, message: 'Google 로그인 코드가 필요합니다.' });
        return;
    }

    try {
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                redirect_uri: process.env.GOOGLE_REDIRECT_URI || '',
                grant_type: 'authorization_code',
            }).toString(),
        });

        if (!tokenRes.ok) {
            res.status(400).json({ success: false, message: 'Google 토큰 요청에 실패했습니다.' });
            return;
        }

        const tokenData = await tokenRes.json();
        const { access_token } = tokenData;
        if (!access_token) {
            res.status(400).json({ success: false, message: 'Google Access Token을 가져오지 못했습니다.' });
            return;
        }

        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userInfoRes.ok) {
            res.status(400).json({ success: false, message: 'Google 사용자 정보 요청에 실패했습니다.' });
            return;
        }

        const userInfo = await userInfoRes.json();
        const { sub: googleId, email, name, picture } = userInfo;
        if (!googleId || !email) {
            res.status(400).json({ success: false, message: 'Google 사용자 정보가 유효하지 않습니다.' });
            return;
        }

        const userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [googleId]);
        let user = userResult.rows[0];

        if (!user) {
            const emailCheck = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
            if (emailCheck.rows.length > 0) {
                res.status(400).json({ success: false, message: '이미 해당 이메일로 가입된 계정이 있습니다.' });
                return;
            }

            const nickname = email.split('@')[0];
            const insertResult = await pool.query(
                `INSERT INTO users (email, full_name, nickname, google_id, profile_img)
                VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [email, name, nickname, googleId, picture]
            );
            user = insertResult.rows[0];
        }

        const accessToken = generateToken(user.id.toString(), 'access');
        const refreshToken = generateToken(user.id.toString(), 'refresh');

        res.cookie('x_clone_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: 'Google 로그인에 성공했습니다.',
            data: {
                user: buildUserResponse(user),
                accessToken,
            },
        });
    } catch (error) {
        console.error('Google 로그인 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getGoogleClientId = async (req: Request, res: Response): Promise<void> => {
    try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            res.status(500).json({ success: false, message: 'Google Client ID가 설정되어 있지 않습니다.' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Google Client ID를 성공적으로 반환했습니다.',
            data: { googleClientId },
        });
    } catch (error) {
        console.error('Google Client ID 가져오기 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

// email verification
export const checkEmailExists = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.query;

    if (!email) {
        res.status(400).json({
            success: false,
            message: '이메일 확인에 실패했습니다.',
            errors: [{ field: 'email', message: '이메일을 입력해 주세요.' }]
        });
        return;
    }

    try {
        const userResult = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: '해당 이메일로 가입된 사용자가 없습니다.',
                errors: [{ field: 'email', message: '해당 이메일로 가입된 사용자가 없습니다.' }],
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: '등록된 이메일입니다.',
            data: { exists: true },
        });
    } catch (error) {
        console.error('Error in checkEmailExists:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const sendEmailCode = async (req: Request, res: Response): Promise<void> => {
    const { email, fullName, isResend, isPasswordReset} = req.body;

    const errors: { field: string; message: string }[] = [];
    if (!email) errors.push({ field: 'email', message: '이메일을 입력해 주세요.' });
    if (!isPasswordReset && !isResend && !fullName) {
        errors.push({ field: 'fullName', message: '이름을 입력해 주세요.' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ field: 'email', message: '이메일 형식이 올바르지 않습니다.' });

    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '이메일 인증 요청에 실패했습니다.', errors });
        return;
    }

    try {
        if (!isPasswordReset) {
            const emailCheck = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
            if (emailCheck.rows.length > 0) {
                res.status(400).json({
                    success: false,
                    message: '이미 사용 중인 이메일입니다.',
                    errors: [{ field: 'email', message: '이미 사용 중인 이메일입니다.' }],
                });
                return;
            }
        }

        const code = generateVerificationCode();
        sendVerificationEmail(email, code);
        const expiresAt = Date.now() + 3 * 60 * 1000;

        await redis.set(`email_code:${email}`, code, { EX: 180 });

        res.status(200).json({
            success: true,
            message: '인증번호를 전송했습니다.',
            data: { expiresAt },
        });
    } catch (error) {
        console.error('Error in sendEmailCode:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const verifyEmailCode = async (req: Request, res: Response): Promise<void> => {
    const { email, code } = req.body;

    const errors: { field: string; message: string }[] = [];
    if (!code) errors.push({ field: 'code', message: '인증번호를 입력해 주세요.' });

    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '인증번호 확인에 실패했습니다.', errors });
        return;
    }

    try {
        const storedCode = await redis.get(`email_code:${email}`);

        if (!storedCode) {
            res.status(400).json({
                success: false,
                message: '인증번호가 만료되었거나 요청이 없습니다.',
                errors: [{ field: 'code', message: '인증번호가 만료되었거나 요청이 없습니다.' }],
            });
            return;
        }

        if (storedCode !== code) {
            res.status(400).json({
                success: false,
                message: '인증번호가 일치하지 않습니다.',
                errors: [{ field: 'code', message: '인증번호가 일치하지 않습니다.' }],
            });
            return;
        }

        await redis.set(`email_verified:${email}`, 'true', { EX: 600 });
        await redis.del(`email_code:${email}`);

        res.status(200).json({
            success: true,
            message: '인증번호가 확인되었습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in verifyEmailCode:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { email, password: newPassword, confirmPassword } = req.body ;
    const errors: { field: string; message: string }[] = [];
    if (!email) errors.push({ field: 'root', message: '이메일을 입력해 주세요.' });
    if (!newPassword) errors.push({ field: 'password', message: '새 비밀번호를 입력해 주세요.' });
    if (newPassword && newPassword.length < 6) {
        errors.push({ field: 'password', message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    }
    if (newPassword !== confirmPassword) {
        errors.push({ field: 'confirmPassword', message: '비밀번호가 일치하지 않습니다.' });
    }
    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '비밀번호 재설정에 실패했습니다.', errors });
        return;
    }
    try {
        const isVerified = await redis.get(`email_verified:${email}`);
        if (!isVerified) {
            res.status(400).json({
                success: false,
                message: '이메일 인증이 필요합니다.',
                errors: [{ field: 'root', message: '이메일 인증이 필요합니다.' }],
            });
            return;
        }

        const result = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: '해당 이메일로 가입된 사용자가 없습니다.',
                errors: [{ field: 'email', message: '해당 이메일로 가입된 사용자가 없습니다.' }],
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password = $1, last_password_change = NOW() WHERE email = $2',[hashedPassword, email]);

        await redis.del(`email_verified:${email}`);
        res.status(200).json({
            success: true,
            message: '비밀번호가 성공적으로 재설정되었습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};