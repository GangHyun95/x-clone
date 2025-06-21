import type { Request, Response } from 'express';

import { pool } from '../lib/db.ts';
import { uploadAndReplaceImage } from '../lib/util.ts';

export const create = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;
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
        const postCheck = await pool.query('SELECT 1 FROM posts WHERE id = $1', [postId]);
        if (postCheck.rowCount === 0) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        let uploadImgUrl = null;
        if (file) {
            uploadImgUrl = await uploadAndReplaceImage(null, file.path);
        }

        const insertResult = await pool.query(
            `INSERT INTO comments (post_id, user_id, content, img) VALUES ($1, $2, $3, $4) RETURNING id`,
            [postId, userId, text, uploadImgUrl]
        );

        const commentId = insertResult.rows[0].id;

        const commentResult = await pool.query(
            `SELECT
                comments.id,
                comments.content,
                comments.img,
                comments.created_at,
                json_build_object(
                    'id', users.id,
                    'username', users.username,
                    'full_name', users.full_name,
                    'profile_img', users.profile_img
                ) as user,
                json_build_object(
                    'like', 0
                ) AS counts
            FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE comments.id = $1`,
            [commentId]
        );

        res.status(201).json({
            success: true,
            message: '댓글이 작성되었습니다.',
            data: {
                comment: commentResult.rows[0]
            }
        });
    } catch (error) {
        console.error('Error in createComment:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};

export const getByPostId = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const postId = req.params.id;

    try {
        const postCheck = await pool.query('SELECT 1 FROM posts WHERE id = $1', [postId]);
        if (postCheck.rowCount === 0) {
            res.status(404).json({ success: false, message: '게시물을 찾을 수 없습니다.' });
            return;
        }

        const result = await pool.query(
            `SELECT
                comments.id,
                comments.content,
                comments.img,
                comments.created_at,
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
                    'like', (SELECT COUNT(*) FROM comment_likes WHERE comment_id = comments.id)
                ) AS counts,
                EXISTS (
                    SELECT 1 FROM comment_likes WHERE comment_id = comments.id AND user_id = $1
                ) AS is_liked
            FROM comments
            JOIN users ON users.id = comments.user_id
            WHERE comments.post_id = $2
            ORDER BY comments.created_at ASC`,
            [userId, postId]
        );

        res.status(200).json({
            success: true,
            message: '댓글 목록을 가져왔습니다.',
            data: {
                comments: result.rows
            }
        });
    } catch (error) {
        console.error('Error in getAllComments:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};
