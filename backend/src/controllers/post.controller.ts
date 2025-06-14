import type { Request, Response } from 'express';

import { pool } from '../lib/db.ts';
import { deleteImage, uploadAndReplaceImage } from '../lib/util.ts';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { text } = req.body;
    const file = req.file;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    if (!text && !file) {
        res.status(400).json({ success: false, message: '텍스트 또는 이미지를 입력해야 합니다.' });
        return;
    }

    try {
        let uploadImgUrl = null;
        if (file) {
            uploadImgUrl = await uploadAndReplaceImage(null, file.path);
        }

        const insertResult = await pool.query(
            `INSERT INTO posts (user_id, content, img) VALUES ($1, $2, $3) RETURNING id`,
            [userId, text || null, uploadImgUrl]
        );

        const postId = insertResult.rows[0].id;

        const postResult = await pool.query(
            `SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.created_at,
                posts.updated_at,
                json_build_object(
                    'id', users.id,
                    'nickname', users.nickname,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img
                ) as user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id),
                    'comment', (SELECT COUNT(*) FROM comments WHERE post_id = posts.id)
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

export const editPost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;
    const { text, removeImage } = req.body;
    const file = req.file

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    if (!text && !file && removeImage !== 'true') {
        res.status(400).json({ success: false, message: '수정할 내용이 없습니다.' });
        return;
    }

    try {
        const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
        const post = result.rows[0];

        if (!post) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        if (post.user_id !== userId) {
            res.status(403).json({ success: false, message: '게시물 수정 권한이 없습니다.' });
            return;
        }

        let newImg = post.img;

        if (removeImage === 'true') {
            if (post.img) {
                await deleteImage(post.img);
                newImg = null;
            }
        }
        
        if (file) {
            newImg = await uploadAndReplaceImage(post.img ?? null, file.path);
        }

        const updateResult = await pool.query(
            `UPDATE posts SET content = $1, img = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
            [text ?? post.content, newImg, postId]
        );

        res.status(200).json({ success: true, message: '게시물이 수정되었습니다.', data: { post: updateResult.rows[0] } });
    } catch (error) {
        console.error('Error in editPost:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

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

export const commentOnPost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;
    const { text } = req.body;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    if (!text) {
        res.status(400).json({ success: false, message: '댓글을 입력해야 합니다.' });
        return;
    }

    try {
        const postCheck = await pool.query('SELECT 1 FROM posts WHERE id = $1', [postId]);
        if (postCheck.rows.length === 0) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        const newComment = await pool.query(
            `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *`,
            [postId, userId, text]
        );

        res.status(200).json({ success: true, message: '댓글이 작성되었습니다.', data: { post: newComment.rows[0] } });
    } catch (error) {
        console.error('Error in commentOnPost:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    try {
        const postResult = await pool.query('SELECT id, user_id, content, img FROM posts WHERE id = $1', [postId]);
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
            await pool.query(
                `INSERT INTO post_likes (post_id, user_id, created_at) VALUES ($1, $2, NOW())`,
                [postId, userId]
            );

            await pool.query(
                `INSERT INTO notifications (from_user_id, to_user_id, type, post_id, created_at)
                VALUES ($1, $2, 'like', $3, NOW())`,
                [userId, post.user_id, post.id]
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
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

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

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const postResult = await pool.query(
            `SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.created_at,
                posts.updated_at,
                json_build_object(
                    'id', users.id,
                    'nickname', users.nickname,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img,
                    'is_following', EXISTS (
                        SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = users.id
                    )
                ) as user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id), 
                    'comment', (SELECT COUNT(*) FROM comments WHERE post_id = posts.id)
                ) AS counts,
                EXISTS (
                    SELECT 1 FROM post_likes WHERE post_id = posts.id AND user_id = $1
                ) AS is_liked,
                EXISTS (
                    SELECT 1 FROM post_bookmarks WHERE post_id = posts.id AND user_id = $1
                ) AS is_bookmarked
            FROM posts
            JOIN users ON users.id = posts.user_id
            ORDER BY posts.created_at DESC`,
            [req.user?.id]
        );

        res.status(200).json({
            success: true,
            message: postResult.rows.length ? '게시물 목록을 가져왔습니다.' : '게시물이 없습니다.',
            data: { posts: postResult.rows },
        });
    } catch (error) {
        console.error('Error in getAllPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getFollowingPosts = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    try {
        const followingResult = await pool.query('SELECT to_user_id FROM user_follows WHERE from_user_id = $1', [userId]);
        const followingIds = followingResult.rows.map(row => row.to_user_id);

        if (followingIds.length === 0) {
            res.status(200).json({ success: true, message: '팔로우한 사용자의 게시물이 없습니다.', data: { posts: [] } });
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
                    'nickname', users.nickname,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img,
                    'is_following', EXISTS (
                        SELECT 1 FROM user_follows WHERE from_user_id = $2 AND to_user_id = users.id
                    )
                ) as user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id), 
                    'comment', (SELECT COUNT(*) FROM comments WHERE post_id = posts.id)
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
            ORDER BY posts.created_at DESC`,
            [followingIds, userId]
        );

        res.status(200).json({
            success: true,
            message: postResult.rows.length ? '피드를 가져왔습니다.' : '팔로우한 사용자의 게시물이 없습니다.',
            data: { posts: postResult.rows },
        });
    } catch (error) {
        console.error('Error in getFollowingPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getLikedPosts = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    try {
        const likedPostResult = await pool.query(
            `SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.created_at,
                posts.updated_at,
                json_build_object(
                    'id', users.id,
                    'nickname', users.nickname,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img,
                    'is_following', EXISTS (
                        SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = users.id
                    )
                ) as user,
                json_build_object(
                    'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id),
                    'comment', (SELECT COUNT(*) FROM comments WHERE post_id = posts.id)
                ) as counts,
                TRUE AS is_liked,
                EXISTS (
                    SELECT 1 FROM post_bookmarks WHERE post_id = posts.id AND user_id = $1
                ) AS is_bookmarked
            FROM post_likes
            JOIN posts ON post_likes.post_id = posts.id
            JOIN users ON users.id = posts.user_id
            WHERE post_likes.user_id = $1
            ORDER BY posts.created_at DESC`,
            [userId]
        );

        res.status(200).json({
            success: true,
            message: likedPostResult.rows.length ? '좋아요한 게시물을 가져왔습니다.' : '좋아요한 게시물이 없습니다.',
            data: { posts: likedPostResult.rows },
        });
    } catch (error) {
        console.error('Error in getLikedPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getBookmarkedPosts = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const keyword = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    try {
        const values: (number | string)[] = [userId];
        let sql = `
            SELECT
                posts.id,
                posts.content,
                posts.img,
                posts.created_at,
                posts.updated_at,
                json_build_object(
                'id', users.id,
                'nickname', users.nickname,
                'full_name', users.full_name,
                'profile_img', users.profile_img,
                'is_following', EXISTS (
                    SELECT 1 FROM user_follows WHERE from_user_id = $1 AND to_user_id = users.id
                )
                ) AS user,
                json_build_object(
                'like', (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id),
                'comment', (SELECT COUNT(*) FROM comments WHERE post_id = posts.id)
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
                OR to_tsvector('simple', users.nickname) @@ plainto_tsquery('simple', $2)
                OR to_tsvector('simple', users.full_name) @@ plainto_tsquery('simple', $2)
                )
            `;
            values.push(keyword);
        }

        sql += ` ORDER BY posts.created_at DESC`;

        const result = await pool.query(sql, values);

        res.status(200).json({
            success: true,
            message: result.rows.length ? '북마크한 게시물을 가져왔습니다.' : '북마크한 게시물이 없습니다.',
            data: { posts: result.rows },
        });
    } catch (error) {
        console.error('Error in getBookmarkedPosts:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

