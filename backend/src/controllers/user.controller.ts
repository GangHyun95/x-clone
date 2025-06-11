import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

import { pool } from '../lib/db.ts';
import { buildUserDetail, buildUserSummary, uploadAndReplaceImage } from '../lib/util.ts';

export const getMe = async (req: Request, res:Response): Promise<void> => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.'});
        return;
    }
    try {
        res.status(200).json({
            success: true,
            message: '유저 정보를 가져왔습니다.',
            data: {
                user: buildUserSummary(user),
            },
        });
    } catch (error) {
        console.error('Error in getMe:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
    const { nickname } = req.params;

    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE nickname = $1', [nickname]);
        const user = rows[0];
        res.status(200).json({
            success: true,
            data: {
                user: buildUserDetail(user),
            }
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const toggleFollow = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const currentUserId = req.user.id;
    const targetUserId = Number(req.params.id);

    if (currentUserId === targetUserId) {
        res.status(400).json({
            success: false,
            message: '자기 자신을 팔로우할 수 없습니다.',
        });
        return;
    }

    try {
        const userCheck = await pool.query('SELECT 1 FROM users WHERE id = $1', [targetUserId]);
        if (userCheck.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        const isFollowing = await pool.query(
            'SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = $2',
            [currentUserId, targetUserId]
        );

        if (isFollowing.rows.length > 0) {
            await pool.query(
                'DELETE FROM user_follows WHERE from_user_id = $1 AND to_user_id = $2',
                [currentUserId, targetUserId]
            );

            res.status(200).json({
                success: true,
                message: '언팔로우 되었습니다.',
                data: {},
            });
        } else {
            await pool.query(
                'INSERT INTO user_follows (from_user_id, to_user_id) VALUES ($1, $2)',
                [currentUserId, targetUserId]
            );

            await pool.query(
                `
                INSERT INTO notifications (from_user_id, to_user_id, type)
                VALUES ($1, $2, 'follow')
                `,
                [currentUserId, targetUserId]
            );

            res.status(200).json({
                success: true,
                message: '팔로우 되었습니다.',
                data: {},
            });
        }
    } catch (error) {
        console.error('Error in followUnfollowUser:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getSuggestedUsers = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const userId = req.user.id;

    try {
        const followingResult = await pool.query(
            'SELECT to_user_id FROM user_follows WHERE from_user_id = $1',
            [userId]
        );
        const followingIds = followingResult.rows.map(row => row.to_user_id);

        const randomUserResult = await pool.query(
            `SELECT id, nickname, full_name, profile_img
            FROM users
            WHERE id != $1
            ORDER BY RANDOM()
            LIMIT 10`,
            [userId]
        );

        const filteredUsers = randomUserResult.rows.filter(
            user => !followingIds.includes(user.id)
        );

        const suggestedUsers = filteredUsers.slice(0, 4);

        res.status(200).json({
            success: true,
            data: {
                users: suggestedUsers.map(user => buildUserSummary(user)),
            },
        });
    } catch (err) {
        console.error('Error in getSuggestedUsers:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const checkNickname = async (req: Request, res: Response): Promise<void> => {
    const { nickname } = req.query;

    if (!nickname || typeof nickname !== 'string') {
        res.status(400).json({
            success: false,
            message: '닉네임을 입력해 주세요.',
        });
        return;
    }
    try {
        const { rows } = await pool.query('SELECT 1 FROM users WHERE nickname = $1', [nickname]);
        if (rows.length > 0) {
            res.status(400).json({
                success: false,
                message: '이미 사용중인 닉네임입니다.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: '사용 가능한 닉네임입니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in checkNickname:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const {
        fullName,
        nickname,
        currentPassword,
        newPassword,
        bio,
        link,
    } = req.body;

    const userId = req.user.id;
    const files = req.files as {
        profileImg?: Express.Multer.File[];
        coverImg?: Express.Multer.File[];
    };

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
            res.status(400).json({ success: false, message: '비밀번호를 모두 입력해 주세요.' });
            return;
        }

        let hashedPassword = user.password;

        if (currentPassword && newPassword) {
            if (!user.password) {
                res.status(400).json({ success: false, message: '비밀번호가 설정되어 있지 않은 계정입니다.' });
                return;
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                res.status(401).json({ success: false, message: '현재 비밀번호가 일치하지 않습니다.' });
                return;
            }

            if (newPassword.length < 6) {
                res.status(400).json({ success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(newPassword, salt);
        }

        if (nickname && nickname !== user.nickname) {
            const nicknameCheckResult = await pool.query(
                'SELECT 1 FROM users WHERE nickname = $1 AND id != $2 LIMIT 1',
                [nickname, userId]
            );
            if (nicknameCheckResult.rows.length > 0) {
                res.status(400).json({ success: false, message: '이미 사용중인 닉네임입니다.' });
                return;
            }
        }

        const newProfileImg = files.profileImg
            ? await uploadAndReplaceImage(user.profile_img, files.profileImg[0].path)
            : user.profile_img;

        const newCoverImg = files.coverImg
            ? await uploadAndReplaceImage(user.cover_img, files.coverImg[0].path)
            : user.cover_img;

        const updatedUserResult = await pool.query(
            `
            UPDATE users
            SET
                full_name = COALESCE($1, full_name),
                nickname = COALESCE($2, nickname),
                password = $3,
                profile_img = $4,
                cover_img = $5,
                bio = COALESCE($6, bio),
                link = COALESCE($7, link),
                updated_at = NOW()
            WHERE id = $8
            RETURNING *
            `,
            [
                fullName,
                nickname || user.nickname,
                hashedPassword,
                newProfileImg,
                newCoverImg,
                bio,
                link,
                userId
            ]
        );

        const updatedUser = updatedUserResult.rows[0];

        res.status(200).json({
            success: true,
            message: '프로필이 업데이트 되었습니다.',
            data: { user: buildUserDetail(updatedUser) }
        });
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const userId = req.user.id;

    try {
        const { rows } = await pool.query('SELECT 1 FROM users WHERE id = $1', [userId]);
        if (rows.length === 0) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        await pool.query(
            'DELETE FROM user_follows WHERE follower_id = $1 OR following_id = $1',
            [userId]
        );

        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        res.status(200).json({
            success: true,
            message: '계정이 삭제되었습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in deleteAccount:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

