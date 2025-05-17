import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { buildUserResponse, generateToken } from '../lib/util.ts';
import User from '../models/user.model.ts';

export const signup = async (req: Request, res: Response): Promise<void> => {
    const { fullName, nickname, email, password } = req.body;
    try {
        if (!fullName || !nickname || !email || !password) {
            res.status(400).json({
                success: false,
                message: '모든 필수 항목을 입력해 주세요.',
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            res.status(400).json({
                success: false,
                message: '이메일 형식이 올바르지 않습니다.',
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: '비밀번호는 최소 6자 이상이어야 합니다.',
            });
            return;
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { nickname }],
        });

        if (existingUser) {
            res.status(400).json({
                success: false,
                message:
                    existingUser.email === email
                        ? '이미 사용 중인 이메일입니다.'
                        : '이미 사용 중인 닉네임입니다.',
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

        if (newUser) {
            const accessToken = generateToken(newUser._id.toString(), 'access');
            const refreshToken = generateToken(
                newUser._id.toString(),
                'refresh'
            );

            res.cookie('x_clone_refresh_token', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
            });

            await newUser.save();

            res.status(201).json({
                success: true,
                message: '회원가입이 완료되었습니다.',
                user: buildUserResponse(newUser),
                accessToken,
            });
        } else {
            res.status(400).json({
                success: false,
                message: '회원가입에 실패했습니다.',
            });
        }
    } catch (error) {
        console.log('Error in signup controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: '모든 필수 항목을 입력해 주세요.',
            });
            return;
        }

        const user = await User.findOne({ email });
        if (!user || !user.password) {
            res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: '이메일 또는 비밀번호가 올바르지 않습니다.',
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
            user: buildUserResponse(user),
            accessToken,
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
        });
    } catch (error) {
        console.log('Error in logout controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const refreshAccessToken = async (
    req: Request,
    res: Response
): Promise<void> => {
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
            accessToken: newAccessToken,
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error('Access Token 갱신 오류:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};
