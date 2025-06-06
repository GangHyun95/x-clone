import type { Request, Response } from 'express';

import { pool } from '../lib/db.ts';
import { deleteImage, uploadAndReplaceImage } from '../lib/util.ts';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const { text, img } = req.body;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    if (!text && !img) {
        res.status(400).json({ success: false, message: '텍스트 또는 이미지를 입력해야 합니다.' });
        return;
    }

    try {
        let uploadImgUrl = null;
        if (img) {
            uploadImgUrl = await uploadAndReplaceImage(null, img);
        }

        const result = await pool.query(
            `INSERT INTO posts (user_id, content, img) VALUES ($1, $2, $3) RETURNING *`,
            [userId, text || null, uploadImgUrl]
        );

        res.status(201).json({ success: true, message: '게시물이 생성되었습니다.', data: { post: result.rows[0] } });
    } catch (error) {
        console.error('Error in createPost:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const editPost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;
    const { text, img } = req.body;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    if (!text && !img) {
        res.status(400).json({ success: false, message: '텍스트 또는 이미지를 입력해야 합니다.' });
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
        if (img === null || img === '') {
            if (post.img) {
                await deleteImage(post.img);
                newImg = null;
            }
        } else if (img) {
            newImg = await uploadAndReplaceImage(post.img ?? null, img);
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

export const likeUnlikePost = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;

    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    try {
        const postResult = await pool.query('SELECT user_id FROM posts WHERE id = $1', [postId]);
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
                message: '게시물의 좋아요가 취소되었습니다.',
                data: {},
            });
        } else {
            await pool.query(
                `INSERT INTO post_likes (post_id, user_id, created_at) VALUES ($1, $2, NOW())`,
                [postId, userId]
            );

            await pool.query(
                `INSERT INTO notifications (from_user_id, to_user_id, type, created_at)
                 VALUES ($1, $2, 'like', NOW())`,
                [userId, post.user_id]
            );

            res.status(200).json({
                success: true,
                message: '게시물에 좋아요가 추가되었습니다.',
                data: {},
            });
        }
    } catch (error) {
        console.error('Error in likeUnlikePost:', error);
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
                    'fullName', users.full_name,
                    'profileImg', users.profile_img
                ) as user
            FROM posts
            JOIN users ON users.id = posts.user_id
            ORDER BY posts.created_at DESC`
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

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
    const { nickname } = req.params;
    try {
        const userResult = await pool.query('SELECT id FROM users WHERE nickname = $1', [nickname]);
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
                    'nickname', users.nickname,
                    'fullName', users.full_name,
                    'profileImg', users.profile_img
                ) as user
            FROM posts
            JOIN users ON users.id = posts.user_id
            WHERE posts.user_id = $1
            ORDER BY posts.created_at DESC`,
            [user.id]
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

export const getFollowingPosts = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    try {
        const followingResult = await pool.query('SELECT following_id FROM user_follows WHERE follower_id = $1', [userId]);
        const followingIds = followingResult.rows.map(row => row.following_id);

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
                    'fullName', users.full_name,
                    'profileImg', users.profile_img
                ) as user
            FROM posts
            JOIN users ON users.id = posts.user_id
            WHERE posts.user_id = ANY($1)
            ORDER BY posts.created_at DESC`,
            [followingIds]
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
    const userId = parseInt(req.params.id);

    try {
        const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
            return;
        }

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
                    'fullName', users.full_name,
                    'profileImg', users.profile_img
                ) as user
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
