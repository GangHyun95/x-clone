import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { pool } from '../lib/db.ts';

export const protectRoute = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;

    try {
        const authHeader = req.headers.authorization;
        if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer')) {
            token = authHeader.split(' ')[1];

            const secret = process.env.ACCESS_TOKEN_SECRET;
            if (!secret) {
                throw new Error('Access token secret is not defined');
            }
            const decoded = jwt.verify(token, secret);

            if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
                res.status(401).json({
                    success: false,
                    message: '로그인이 필요합니다.',
                });
                return;
            }

            const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
            const user = result.rows[0];
            if (!user) {
                res.status(404).json({
                    success: false,
                    message: '사용자를 찾을 수 없습니다.',
                });
                return;
            }

            req.user = user;

            next();
        } else {
            res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.',
            });
        }
    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        res.status(401).json({
            success: false,
            message: '토큰 인증에 실패했습니다.',
        });
    }
};
