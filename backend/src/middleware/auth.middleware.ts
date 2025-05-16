import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.ts';

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

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
                return res.status(401).json({
                    success: false,
                    message: '로그인이 필요합니다.',
                });
            }

            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: '사용자를 찾을 수 없습니다.',
                });
            }

            req.user = user;

            next();
        } else {
            return res.status(401).json({
                success: false,
                message: '로그인이 필요합니다.',
            });
        }
    } catch (error) {
        console.error('Error in protectRoute middleware:', error);
        return res.status(401).json({
            success: false,
            message: '토큰 인증에 실패했습니다.',
        });
    }
};
