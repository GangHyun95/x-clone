import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { pool } from '../lib/db.ts';
import { redis } from '../lib/redis.ts';
import { generateToken } from '../lib/util.ts';

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
            },
        });
    } catch (error) {
        console.error('Access Token 갱신 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};
