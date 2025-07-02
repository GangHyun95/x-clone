import type { Request, Response } from 'express';

import { deleteImage, uploadAndReplaceImage } from '../lib/cloudinary.ts';
import { pool } from '../lib/db/index.ts';
import { paginate } from '../lib/db/paginate.ts';
import { getTweetLength } from '../lib/util.ts';

export const create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const { text, parentId } = req.body;
    const file = req.file;

    if (!text && !file) {
        res.status(400).json({ success: false, message: '텍스트 또는 이미지를 입력해야 합니다.' });
        return;
    }

    if (text && getTweetLength(text) > 280) {
        res.status(400).json({
            success: false,
            message: '텍스트는 280자 이하로 입력해 주세요.',
            errors: [{ field: 'text', message: '텍스트는 280자 이하로 입력해 주세요.' }],
        });
        return;
    }

    try {
        let uploadImgUrl = null;
        if (file) {
            uploadImgUrl = await uploadAndReplaceImage(null, file.path);
        }

        const insertResult = await pool.query(
            `INSERT INTO posts (user_id, content, img, parent_id) VALUES ($1, $2, $3, $4) RETURNING id`,
            [userId, text || null, uploadImgUrl,parentId || null]
        );

        const postId = insertResult.rows[0].id;

        const postResult = await pool.query(
            `SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.parent_id,
                posts.created_at,
                posts.updated_at,
                json_build_object(
                    'id', users.id,
                    'username', users.username,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img
                ) as user,
                json_build_object(
                    'like', 0,
                    'comment', 0
                ) AS counts
            FROM posts
            JOIN users ON users.id = posts.user_id
            WHERE posts.id = $1`,
            [postId]
        );

        res.status(201).json({ success: true, message: '게시물이 생성되었습니다.', data: { post: postResult.rows[0] } });
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
        const post = result.rows[0];

        if (!post) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        if (post.user_id !== userId) {
            res.status(403).json({ success: false, message: '게시물 삭제 권한이 없습니다.' });
            return;
        }

        if (post.img) await deleteImage(post.img);
        await pool.query('DELETE FROM posts WHERE id = $1', [postId]);

        res.status(200).json({ success: true, message: '게시물이 삭제되었습니다.', data: {} });
    } catch (error) {
        console.error('Error in deletePost:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const postResult = await pool.query('SELECT id, user_id, content, img, parent_id FROM posts WHERE id = $1', [postId]);
        const post = postResult.rows[0];

        if (!post) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        const likeCheck = await pool.query(
            `SELECT 1 FROM post_likes WHERE post_id = $1 AND user_id = $2`,
            [postId, userId]
        );

        if (likeCheck.rows.length > 0) {
            await pool.query(`DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2`, [postId, userId]);

            res.status(200).json({
                success: true,
                message: '좋아요가 취소되었습니다.',
                data: {},
            });
        } else {
            const type = post.parent_id !== null ? 'comment_like' : 'like';
            await pool.query(
                `INSERT INTO post_likes (post_id, user_id, created_at) VALUES ($1, $2, NOW())`,
                [postId, userId]
            );

            await pool.query(
                `INSERT INTO notifications (from_user_id, to_user_id, type, post_id, created_at)
                VALUES ($1, $2, $3, $4, NOW())`,
                [userId, post.user_id, type, post.id]
            );

            res.status(200).json({
                success: true,
                message: '좋아요가 추가되었습니다.',
                data: {},
            });
        }
    } catch (error) {
        console.error('Error in toggleLike:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const toggleBookmark = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const postCheck = await pool.query('SELECT 1 FROM posts WHERE id = $1', [postId]);
        if (postCheck.rows.length === 0) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        const bookmarkCheck = await pool.query(
            `SELECT 1 FROM post_bookmarks WHERE post_id = $1 AND user_id = $2`,
            [postId, userId]
        );

        if (bookmarkCheck.rows.length > 0) {
            await pool.query(`DELETE FROM post_bookmarks WHERE post_id = $1 AND user_id = $2`, [postId, userId]);

            res.status(200).json({
                success: true,
                message: '북마크가 취소되었습니다.',
                data: {},
            });
        } else {
            await pool.query(
                `INSERT INTO post_bookmarks (post_id, user_id, created_at) VALUES ($1, $2, NOW())`,
                [postId, userId]
            );

            res.status(200).json({
                success: true,
                message: '북마크가 추가되었습니다.',
                data: {},
            });
        }
    } catch (error) {
        console.error('Error in toggleBookmark:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const parentId = req.query.parentId ? parseInt(req.query.parentId as string, 10) : null;
    const cursor =
        req.query.cursorDate && req.query.cursorId
            ? { cursorDate: new Date(req.query.cursorDate as string), cursorId: parseInt(req.query.cursorId as string, 10) }
            : null;

    try {
        const values: (number | string | Date)[] = [userId];
        let idx = 2;

        let sql = `
            SELECT
                p.id,
                p.content,
                p.img,
                p.parent_id,
                p.created_at,
                p.updated_at,
                json_build_object(
                    'id', users.id,
                    'username', users.username,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img,
                    'is_following', EXISTS (
                        SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = users.id
                    )
                ) as user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id),
                    'comment', (SELECT COUNT(*) FROM posts WHERE parent_id = p.id)
                ) AS counts,
                EXISTS (
                    SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1
                ) AS is_liked,
                EXISTS (
                    SELECT 1 FROM post_bookmarks WHERE post_id = p.id AND user_id = $1
                ) AS is_bookmarked
            FROM posts p
            JOIN users ON users.id = p.user_id
        `;

        if (parentId === null) {
            sql += ' WHERE p.parent_id IS NULL';
        } else {
            sql += ` WHERE p.parent_id = $${idx}`;
            values.push(parentId);
            idx++;
        }

        const { items: posts, hasNextPage, nextCursor } = await paginate(sql, values, cursor, { order: ['p.created_at', 'p.id']});

        res.status(200).json({
            success: true,
            message: posts.length ? '게시물을 가져왔습니다.' : '게시물이 없습니다.',
            data: {
                posts,
                hasNextPage,
                nextCursor,
            },
        });
    } catch (error) {
        console.error('Error in getAllPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const postId = req.params.id;

    try {
        const postResult = await pool.query(
            `
            SELECT
                p.id,
                p.content,
                p.img,
                p.parent_id,
                p.created_at,
                p.updated_at,
                json_build_object(
                    'id', users.id,
                    'username', users.username,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img,
                    'is_following', EXISTS (
                        SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = users.id
                    )
                ) as user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id), 
                    'comment', (SELECT COUNT(*) FROM posts WHERE parent_id = p.id)
                ) AS counts,
                EXISTS (
                    SELECT 1 FROM post_likes WHERE post_id = p.id AND user_id = $1
                ) AS is_liked,
                EXISTS (
                    SELECT 1 FROM post_bookmarks WHERE post_id = p.id AND user_id = $1
                ) AS is_bookmarked
            FROM posts p
            JOIN users ON users.id = p.user_id
            WHERE p.id = $2

            `,
            [userId, postId]
        );

        if (postResult.rows.length === 0) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        res.status(200).json({
            success: true,
            message: '게시물을 가져왔습니다.',
            data: { post: postResult.rows[0] },
        });

    } catch (error) {
        console.error('Error in getOne:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getFromFollowing = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const cursor =
        req.query.cursorDate && req.query.cursorId
            ? { cursorDate: new Date(req.query.cursorDate as string), cursorId: parseInt(req.query.cursorId as string, 10) }
            : null;

    try {
        const followingResult = await pool.query('SELECT to_user_id FROM user_follows WHERE from_user_id = $1', [userId]);
        const followingIds = followingResult.rows.map(row => row.to_user_id);

        if (followingIds.length === 0) {
            res.status(200).json({
                success: true,
                message: '팔로우한 사용자의 게시물이 없습니다.',
                data: { posts: [], hasNextPage: false, nextCursor: null },
            });
            return;
        }

        const values: (number | Date | number[])[] = [followingIds, userId];

        const sql = `
            SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.parent_id,
                posts.created_at,
                posts.updated_at,
                json_build_object(
                    'id', users.id,
                    'username', users.username,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img,
                    'is_following', EXISTS (
                        SELECT 1 FROM user_follows WHERE from_user_id = $2 AND to_user_id = users.id
                    )
                ) as user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id), 
                    'comment', (SELECT COUNT(*) FROM posts WHERE parent_id = posts.id)
                ) AS counts,
                EXISTS (
                    SELECT 1 FROM post_likes WHERE post_id = posts.id AND user_id = $2
                ) AS is_liked,
                EXISTS (
                    SELECT 1 FROM post_bookmarks WHERE post_id = posts.id AND user_id = $2
                ) AS is_bookmarked
            FROM posts
            JOIN users ON users.id = posts.user_id
            WHERE posts.user_id = ANY($1)
        `;

        const { items: posts, hasNextPage, nextCursor } = await paginate(sql, values, cursor, { order: ['posts.created_at', 'posts.id']});

        res.status(200).json({
            success: true,
            message: posts.length ? '피드를 가져왔습니다.' : '팔로우한 사용자의 게시물이 없습니다.',
            data: {
                posts,
                hasNextPage,
                nextCursor,
            },
        });
    } catch (error) {
        console.error('Error in getFollowingPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getLiked = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.query;
    const currentUserId = req.user.id;
    const cursor =
        req.query.cursorDate && req.query.cursorId
            ? { cursorDate: new Date(req.query.cursorDate as string), cursorId: parseInt(req.query.cursorId as string, 10) }
            : null;
    try {
        const userResult = await pool.query(
            `SELECT id FROM users WHERE username = $1`,
            [username]
        );
        const targetUser = userResult.rows[0];

        if (!targetUser) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        const values: (number | Date)[] = [currentUserId, targetUser.id];
        const sql = `
            SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.parent_id,
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
                TRUE AS is_liked,
                EXISTS (
                    SELECT 1 FROM post_bookmarks WHERE post_id = posts.id AND user_id = $1
                ) AS is_bookmarked
            FROM post_likes
            JOIN posts ON post_likes.post_id = posts.id
            JOIN users ON users.id = posts.user_id
            WHERE post_likes.user_id = $2
        `;

        const { items: posts, hasNextPage, nextCursor } = await paginate(sql, values, cursor, { order: ['posts.created_at', 'posts.id'] });

        res.status(200).json({
            success: true,
            message: posts.length ? '좋아요한 게시물을 가져왔습니다.' : '좋아요한 게시물이 없습니다.',
            data: { posts, hasNextPage, nextCursor },
        });
    } catch (error) {
        console.error('Error in getLikedPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getBookmarked = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const keyword = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    const cursor =
        req.query.cursorDate && req.query.cursorId
            ? { cursorDate: new Date(req.query.cursorDate as string), cursorId: parseInt(req.query.cursorId as string, 10) }
            : null;
    try {
        const values: (number | string | Date)[] = [userId];
        let sql = `
            SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.parent_id,
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
                TRUE AS is_bookmarked
            FROM post_bookmarks
            JOIN posts ON posts.id = post_bookmarks.post_id
            JOIN users ON users.id = posts.user_id
            WHERE post_bookmarks.user_id = $1
        `;

        if (keyword) {
            sql += `
                AND (
                to_tsvector('simple', posts.content) @@ plainto_tsquery('simple', $2)
                OR to_tsvector('simple', users.username) @@ plainto_tsquery('simple', $2)
                OR to_tsvector('simple', users.full_name) @@ plainto_tsquery('simple', $2)
                )
            `;
            values.push(keyword);
        }

        const { items: posts, hasNextPage, nextCursor } = await paginate(sql, values, cursor, { order: ['posts.created_at', 'posts.id'] });

        res.status(200).json({
            success: true,
            message: posts.length ? '북마크한 게시물을 가져왔습니다.' : '북마크한 게시물이 없습니다.',
            data: { posts, hasNextPage, nextCursor },
        });
    } catch (error) {
        console.error('Error in getBookmarkedPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getByUsername = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.query;
    const currentUserId = req.user.id;
    const cursor =
        req.query.cursorDate && req.query.cursorId
            ? { cursorDate: new Date(req.query.cursorDate as string), cursorId: parseInt(req.query.cursorId as string, 10) }
            : null;
    try {
        const { rows } = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
        const user = rows[0];

        if (!user) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

        
        const values: (number | Date)[] = [currentUserId, user.id];
        const sql = `
            SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.parent_id,
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
                    'like',    (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id),
                    'comment', (SELECT COUNT(*) FROM posts      WHERE parent_id = posts.id)
                ) AS counts,
                EXISTS (SELECT 1 FROM post_likes      WHERE post_id = posts.id AND user_id = $1) AS is_liked,
                EXISTS (SELECT 1 FROM post_bookmarks  WHERE post_id = posts.id AND user_id = $1) AS is_bookmarked
            FROM posts
            JOIN users ON users.id = posts.user_id
            WHERE posts.user_id = $2
                AND posts.parent_id IS NULL
        `;

        const { items: posts, hasNextPage, nextCursor } = await paginate(sql, values, cursor, { order: ['posts.created_at', 'posts.id'] });

        res.status(200).json({
            success: true,
            message: posts.length ? '게시물 목록을 가져왔습니다.' : '게시물이 없습니다.',
            data: { posts, hasNextPage, nextCursor },
        });
    } catch (error) {
        console.error('Error in getByUsername:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

