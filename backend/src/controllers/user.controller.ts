import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';

import { pool } from '../lib/db.ts';
import { buildUserDetail, buildUserSummary, uploadAndReplaceImage } from '../lib/util.ts';

export const getMe = async (req: Request, res: Response): Promise<void> => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    try {
        const result = await pool.query(
            `SELECT
                (SELECT COUNT(*) FROM posts WHERE user_id = $1 AND parent_id IS NULL) AS post_count,
                (SELECT COUNT(*) FROM user_follows WHERE from_user_id = $1) AS following_count,
                (SELECT COUNT(*) FROM user_follows WHERE to_user_id = $1) AS follower_count
            `,
            [user.id]
        );

        const { post_count, following_count, follower_count } = result.rows[0];
        res.status(200).json({
            success: true,
            message: '유저 정보를 가져왔습니다.',
            data: {
                user: buildUserDetail({
                    ...user,
                    post_count: post_count,
                    status: {
                        following: Number(following_count),
                        follower: Number(follower_count),
                    }
                }),
            },
        });
    } catch (error) {
        console.error('Error in getMe:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
        const userResult = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        const user = userResult.rows[0];

        if (!user) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        const postResult = await pool.query(
            `SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.created_at,
                posts.updated_at,
                json_build_object(
                    'id', users.id,
                    'username', users.username,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img,
                    'is_following', EXISTS (
                        SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = users.id
                    )
                ) AS user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id),
                    'comment', (SELECT COUNT(*) FROM posts WHERE parent_id = posts.id)
                ) AS counts,
                EXISTS (
                    SELECT 1 FROM post_likes WHERE post_id = posts.id AND user_id = $1
                ) AS is_liked,
                EXISTS (
                    SELECT 1 FROM post_bookmarks WHERE post_id = posts.id AND user_id = $1
                ) AS is_bookmarked
            FROM posts
            JOIN users ON users.id = posts.user_id
            WHERE posts.user_id = $2 AND posts.parent_id IS NULL
            ORDER BY posts.created_at DESC`,
            [req.user?.id, user.id]
        );

        res.status(200).json({
            success: true,
            message: postResult.rows.length ? '게시물 목록을 가져왔습니다.' : '게시물이 없습니다.',
            data: { posts: postResult.rows },
        });
    } catch (error) {
        console.error('Error in getUserPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    try {
        const userResult = await pool.query(
            `SELECT
                users.id,
                users.username,
                users.full_name,
                users.email,
                users.profile_img,
                users.cover_img,
                users.bio,
                users.link,
                users.created_at,
                users.updated_at,
                CASE
                    WHEN users.id != $1 THEN (
                        SELECT EXISTS (
                            SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = users.id
                        )
                    )
                    ELSE NULL
                END AS is_following,
                (SELECT COUNT(*) FROM posts WHERE posts.user_id = users.id AND posts.parent_id IS NULL) AS post_count,
                json_build_object(
                    'following', (SELECT COUNT(*) FROM user_follows WHERE users.id = from_user_id),
                    'follower',  (SELECT COUNT(*) FROM user_follows WHERE users.id = to_user_id)
                ) AS status
            FROM users
            WHERE username = $2`,
            [req.user?.id, username]
        );

        const user = userResult.rows[0];
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

export const getSuggested = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const userId = req.user.id;
    const excludedUsername = req.query.exclude as string | undefined;

    try {
        const values: (number|string)[] = [userId];
        let sql = `
            SELECT id, username, full_name, profile_img
            FROM users
            WHERE id != $1
                AND id NOT IN (
                    SELECT to_user_id FROM user_follows WHERE from_user_id = $1
                )
        `;

        if (excludedUsername) {
            sql += ` AND username != $2`;
            values.push(excludedUsername);
        }

        sql += ` ORDER BY RANDOM() LIMIT 4`;

        const randomUserResult = await pool.query(sql, values);
        res.status(200).json({
            success: true,
            data: {
                users: randomUserResult.rows.map(user => buildUserSummary(user)),
            },
        });
    } catch (err) {
        console.error('Error in getSuggestedUsers:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getRecommended = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const userId = req.user.id;
    try {
        const randomUserResult = await pool.query(
            `
            SELECT id, username, full_name, profile_img, bio
            FROM users
            WHERE id != $1
                AND id NOT IN (
                    SELECT to_user_id FROM user_follows WHERE from_user_id = $1
                )
            ORDER BY RANDOM()
            `,
            [userId]
        );

        res.status(200).json({
            success: true,
            data: {
                users: randomUserResult.rows.map(user => buildUserSummary(user)),
            },
        });
    } catch (err) {
        console.error('Error in getRecommended:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getFollowers = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const currentUserId = req.user?.id;

    try {
        const targetUserResult = await pool.query(`SELECT id FROM users WHERE username = $1`, [username]);
        const targetUserId = targetUserResult.rows[0]?.id;
        
        if (!targetUserId) {
            res.status(404).json({
                success: false,
                message: '해당 유저를 찾을 수 없습니다.'
            });
            return;
        }
        
        const result = await pool.query(
            `
            SELECT id, username, full_name, profile_img, bio,
                EXISTS (
                    SELECT 1 FROM user_follows
                    WHERE from_user_id = $1 AND to_user_id = users.id
                ) AS is_following
            FROM users
            WHERE id IN (
                SELECT from_user_id FROM user_follows WHERE to_user_id = $2
            )
            ORDER BY id DESC
            `,
            [currentUserId, targetUserId]
        );

        res.status(200).json({
            success: true,
            data: {
                users: result.rows.map(user => buildUserSummary(user))
            }
        })
    } catch (err) {
        console.error('Error in getFollowers:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getFollowing = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;
    const currentUserId = req.user?.id;

    try {
        const targetUserResult = await pool.query(`SELECT id FROM users WHERE username = $1`, [username]);
        const targetUserId = targetUserResult.rows[0]?.id;

        if (!targetUserId) {
            res.status(404).json({
                success: false,
                message: '해당 유저를 찾을 수 없습니다.'
            });
            return;
        }

        const result = await pool.query(
            `
            SELECT id, username, full_name, profile_img, bio,
                EXISTS (
                    SELECT 1 FROM user_follows
                    WHERE from_user_id = $1 AND to_user_id = users.id
                ) AS is_following
            FROM users
            WHERE id IN (
                SELECT to_user_id FROM user_follows WHERE from_user_id = $2
            )
            ORDER BY id DESC
            `,
            [currentUserId, targetUserId]
        );

        res.status(200).json({
            success: true,
            data: {
                users: result.rows.map(user => buildUserSummary(user))
            }
        });
    } catch (err) {
        console.error('Error in getFollowing:', err);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
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
                data: {
                    is_following: false,
                },
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
                data: {
                    is_following: true,
                },
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

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const { fullName, bio, link } = req.body;
    const userId = req.user.id;

    const files = req.files as {
        profileImg: Express.Multer.File[];
        coverImg: Express.Multer.File[];
    };

    if (typeof bio === 'string' && bio.length > 160) {
        res.status(400).json({
            success: false,
            message: 'Bio는 160자 이하로 입력해 주세요.',
            errors: [{ field: 'bio', message: 'Bio는 160자 이하로 입력해 주세요.' }],
        });
        return;
    }

    try {
        const { rows } = await pool.query(
            `SELECT id, full_name, profile_img, cover_img, bio, link FROM users WHERE id = $1`,
            [userId]
        );
        const user = rows[0];

        let sql = `UPDATE users SET `;
        const values: (string | number | null)[] = [];
        let idx = 1;

        if (fullName && fullName !== user.full_name) {
            sql += `full_name = $${idx++}, `;
            values.push(fullName);
        }

        if (bio !== user.bio) {
            sql += `bio = $${idx++}, `;
            values.push(bio);
        }

        if (typeof link === 'string') {
            if (/\s/.test(link)) {
                res.status(400).json({
                    success: false,
                    message: '링크에는 공백을 포함할 수 없습니다.',
                    errors: [{ field: 'link', message: '링크에는 공백을 포함할 수 없습니다.' }],
                });
                return;
            }

            let cleanLink: string | null = link === '' ? null : link;

            if (cleanLink && !cleanLink.startsWith('http://') && !cleanLink.startsWith('https://')) {
                cleanLink = `http://${cleanLink}`;
            }

            if (cleanLink !== user.link) {
                sql += `link = $${idx++}, `;
                values.push(cleanLink);
            }
        }

        if (files.profileImg?.[0]) {
            const newProfileImg = await uploadAndReplaceImage(user.profile_img, files.profileImg[0].path);
            sql += `profile_img = $${idx++}, `;
            values.push(newProfileImg);
        }

        if (files.coverImg?.[0]) {
            const newCoverImg = await uploadAndReplaceImage(user.cover_img, files.coverImg[0].path);
            sql += `cover_img = $${idx++}, `;
            values.push(newCoverImg);
        }

        if (values.length === 0) {
            res.status(200).json({
                success: true,
                message: '변경 사항 없음',
                data: { user: buildUserDetail(user) }
            });
            return;
        }

        sql = sql.slice(0, -2);
        sql += `, updated_at = NOW() `;
        sql += `WHERE id = $${idx} RETURNING *`;
        values.push(userId);

        const { rows: updatedRows } = await pool.query(sql, values);
        const updatedUser = updatedRows[0];

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

export const updateUsername = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const userId = req.user.id;
    const { username } = req.body;

    if (!username) {
        res.status(400).json({
            success: false,
            message: '사용자 이름을 입력해 주세요.',
            errors: [{ field: 'username', message: '사용자 이름을 입력해 주세요.'}]
        })
    }

    if (username.length < 4 || username.length > 15) {
        res.status(400).json({
            success: false,
            message: '사용자 이름은 4자 이상 15자 이하로 입력해 주세요.',
            errors: [{ field: 'username', message: '사용자 이름은 4자 이상 15자 이하로 입력해 주세요.' }],
        });
        return;
    }

    try {
        const { rows } = await pool.query(
            'SELECT 1 FROM users WHERE username = $1 AND id != $2',
            [username, userId]
        );

        if (rows.length > 0) {
            res.status(400).json({
                success: false,
                message: '이미 사용 중인 사용자 이름입니다.',
                errors: [{ field: 'username', message: '이미 사용 중인 사용자 이름입니다.'}],
            });
            return;
        }

        await pool.query(
            'UPDATE users SET username = $1 WHERE id = $2',
            [username, userId]
        );

        res.status(200).json({
            success: true,
            message: '사용자 이름이 성공적으로 변경되었습니다.',
            data: { username: username },
        });
    } catch (error) {
        console.error('Error updating username:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const { currentPassword, newPassword, confirmPassword} = req.body;
    const userId = req.user?.id;
    const errors: { field: string; message: string}[] = [];

    if (!currentPassword) errors.push({ field: 'currentPassword', message: '현재 비밀번호를 입력해 주세요.'})
    if (!newPassword) errors.push({ field: 'newPassword', message: '새 비밀번호를 입력해주세요.'})
    if (newPassword && newPassword.length < 6) errors.push({ field: 'newPassword', message: '비밀번호는 최소 6자 이상이어야 합니다.' });
    if (!confirmPassword) errors.push({ field: 'confirmPassword', message: '비밀번호 확인을 입력해 주세요.'});
    if (newPassword !== confirmPassword) errors.push({ field: 'confirmPassword', message: '비밀번호가 일치하지 않습니다.'});

    if (errors.length > 0) {
        res.status(400).json({ success: false, message: '비밀번호 변경에 실패했습니다.', errors });
        return;
    }

    try {
        const { rows } = await pool.query('SELECT password from users WHERE id = $1', [userId])
        const { password } = rows[0];

        const isMatch = await bcrypt.compare(currentPassword, password);
        if (!isMatch) {
            res.status(403).json({
                success: false,
                message: '현재 비밀번호가 올바르지 않습니다.',
                errors: [{ field: 'currentPassword', message: '현재 비밀번호가 올바르지 않습니다.'}],
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

        res.status(200).json({
            success: true,
            message: '비밀번호가 변경되었습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in changePassword:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const userId = req.user.id;
    const { password: currentPassword } = req.body;

    try {
        const { rows } = await pool.query('SELECT password from users WHERE id = $1', [userId])
        const { password } = rows[0];

        const isMatch = await bcrypt.compare(currentPassword, password);
        if (!isMatch) {
            res.status(403).json({
                success: false,
                message: '현재 비밀번호가 올바르지 않습니다.',
                errors: [{ field: 'password', message: '현재 비밀번호가 올바르지 않습니다.'}],
            });
            return;
        }
        await pool.query(
            'DELETE FROM user_follows WHERE from_user_id = $1 OR to_user_id = $1',
            [userId]
        );

        await pool.query('DELETE FROM users WHERE id = $1', [userId]);

        res.clearCookie('x_clone_refresh_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

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

