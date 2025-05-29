import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { sendVerificationEmail } from '@/lib/email.ts';
import { redis } from '@/lib/redis.ts';
import { buildUserResponse, generateToken, generateVerificationCode } from '@/lib/util.ts';
import User from '@/models/user.model.ts';


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
        res.status(400).json({
            success: false,
            message: '회원가입에 실패했습니다.',
            errors,
        });
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

        const existingUser = await User.findOne({ nickname });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: '이미 사용 중인 닉네임입니다.',
                errors: [{ field: 'nickname', message: '이미 사용 중인 닉네임입니다.' }],
            });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            nickname,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const accessToken = generateToken(newUser._id.toString(), 'access');
        const refreshToken = generateToken(newUser._id.toString(), 'refresh');

        res.cookie('x_clone_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
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
        console.log('Error in signup controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const errors: { field: string; message: string }[] = [];
    if (!email) errors.push({ field: 'email', message: '이메일을 입력해 주세요.' });
    if (!password) errors.push({ field: 'password', message: '비밀번호를 입력해 주세요.' });

    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '로그인에 실패했습니다.', errors });
        return;
    }
    try {
        const user = await User.findOne({ email });
        if (!user || !user.password) {
            res.status(401).json({
                success: false,
                errors: [
                    { field: 'email', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
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
                    { field: 'email', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                    { field: 'password', message: '이메일 또는 비밀번호가 올바르지 않습니다.' },
                ]
            });
            return;
        }

        const accessToken = generateToken(user._id.toString(), 'access');
        const refreshToken = generateToken(user._id.toString(), 'refresh');

        res.cookie('x_clone_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
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
        console.log('Error in login controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
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
        console.log('Error in logout controller:', error);
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
            res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.',
            });
            return;
        }

        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) {
            throw new Error('Refresh token secret is not defined');
        }

        const decoded = jwt.verify(refreshToken, secret);

        if (typeof decoded === 'string' || !('id' in decoded)) {
            res.status(403).json({
                success: false,
                message: 'Refresh Token이 유효하지 않습니다.',
            });
            return;
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        const newAccessToken = generateToken(user._id.toString(), 'access');
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
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

// social login
export const googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({
            success: false,
            message: 'Google 로그인 코드가 필요합니다.',
        });
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
            res.status(400).json({
                success: false,
                message: 'Google 토큰 요청에 실패했습니다.',
            });
            return;
        }

        const tokenData = await tokenRes.json();
        const { access_token } = tokenData;

        if (!access_token) {
            res.status(400).json({
                success: false,
                message: 'Google Access Token을 가져오지 못했습니다.',
            });
            return;
        }

        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        if (!userInfoRes.ok) {
            res.status(400).json({
                success: false,
                message: 'Google 사용자 정보 요청에 실패했습니다.',
            });
            return;
        }

        const userInfo = await userInfoRes.json();
        const { sub: googleId, email, name, picture } = userInfo;

        if (!googleId || !email) {
            res.status(400).json({
                success: false,
                message: 'Google 사용자 정보가 유효하지 않습니다.',
            });
            return;
        }

        let user = await User.findOne({ googleId });

        if (!user) {
            const emailOwner = await User.findOne({ email });
            if (emailOwner) {
                res.status(400).json({
                    success: false,
                    message: '이미 해당 이메일로 가입된 계정이 있습니다.',
                });
                return;
            }
            user = new User({
                googleId,
                email,
                fullName: name,
                nickname: email.split('@')[0],
                profileImage: picture,
            });

            await user.save();
        }

        const accessToken = generateToken(user._id.toString(), 'access');
        const refreshToken = generateToken(user._id.toString(), 'refresh');

        res.cookie('x_clone_refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
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
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getGoogleClientId = async (req: Request, res: Response) => {
    try {
        const googleClientId = process.env.GOOGLE_CLIENT_ID;
        if (!googleClientId) {
            res.status(500).json({
                success: false,
                message: 'Google Client ID가 설정되어 있지 않습니다.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Google Client ID를 성공적으로 반환했습니다.',
            data: { googleClientId },
        });
    } catch (error) {
        console.error('Google Client ID 가져오기 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

// email verification
export const checkEmailExists = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.query;
    const errors: { field: string; message: string }[] = [];
    if (!email) errors.push({ field: 'email', message: '이메일을 입력해 주세요.' });
    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '이메일 확인에 실패했습니다.', errors });
        return;
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
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
        console.error('Error in checkEmailExists controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
        return;
    }
}

export const sendEmailCode = async (req: Request, res: Response): Promise<void> => {
    const { email, fullName, isResend } = req.body;

    const errors: { field: string; message: string }[] = [];
    if (!email) errors.push({ field: 'email', message: '이메일을 입력해 주세요.' });
    if (!isResend && !fullName) errors.push({ field: 'fullName', message: '이름을 입력해 주세요.' });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ field: 'email', message: '이메일 형식이 올바르지 않습니다.' });

    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '이메일 인증 요청에 실패했습니다.', errors});
        return;
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: '이미 사용 중인 이메일입니다.',
                errors: [
                    { field: 'email', message: '이미 사용 중인 이메일입니다.' },
                ],
            });
            return;
        }

        const code = generateVerificationCode();

        sendVerificationEmail(email, code);

        const expiresAt = Date.now() + 3 * 60 * 1000;

        await redis.set(`email_code:${email}`, code, { EX: 180 });

        res.status(200).json({
            success: true,
            message: '인증번호를 전송했습니다.',
            data: {
                expiresAt,
            },
        });
    } catch (error) {
        console.error('Error in requestEmailVerification controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
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
                errors: [
                    { field: 'code', message: '인증번호가 일치하지 않습니다.' },
                ],
            });
            return;
        }

        await redis.set(`email_verified:${email}`, 'true', { EX: 300 });
        await redis.del(`email_code:${email}`);

        res.status(200).json({
            success: true,
            message: '인증번호가 확인되었습니다.',
            data: {}
        });
    } catch (error) {
        console.error('Error in verifyEmailCode controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};
