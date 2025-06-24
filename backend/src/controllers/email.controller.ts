import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

import { pool } from '../lib/db.ts';
import { sendVerificationEmail } from '../lib/email.ts';
import { redis } from '../lib/redis.ts';
import { generateVerificationCode } from '../lib/util.ts';

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
    if (!isPasswordReset && !isResend) {
        if (!fullName) {
            errors.push({ field: 'fullName', message: '이름을 입력해 주세요.' });
        } else if (fullName.length > 50) {
            errors.push({ field: 'fullName', message: '이름은 50자 이하로 입력해 주세요.' });
        }
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