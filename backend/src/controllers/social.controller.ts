import type { Request, Response } from 'express';

import { pool } from '../lib/db/index.ts';
import { generateToken } from '../lib/util.ts';

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

            const username = email.split('@')[0];
            const insertResult = await pool.query(
                `INSERT INTO users (email, full_name, username, google_id, profile_img)
                VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [email, name, username, googleId, picture]
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
