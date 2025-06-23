import type { Request, Response } from 'express';

import { pool } from '../lib/db.ts';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        return;
    }

    const userId = req.user.id;
    const type = req.query.type;

    try {
        const notificationsResult = await pool.query(
            `SELECT
                n.id,
                n.type,
                n.read,
                n.created_at,
                json_build_object(
                    'id', u.id,
                    'username', u.username,
                    'profile_img', u.profile_img
                ) AS user,
                CASE
                    WHEN n.post_id IS NOT NULL THEN (
                        SELECT json_build_object(
                            'id', posts.id,
                            'content', posts.content,
                            'img', posts.img
                        )
                        FROM posts
                        WHERE posts.id = n.post_id
                    )
                    ELSE NULL
                END AS post
            FROM notifications n
            JOIN users u ON u.id = n.from_user_id
            WHERE n.to_user_id = $1
            AND ($2::text IS NULL OR n.type = $2)
            ORDER BY n.created_at DESC`,
            [userId, type]
            );


        await pool.query(
            `UPDATE notifications SET read = true WHERE to_user_id = $1`,
            [userId]
        );

        res.status(200).json({
            success: true,
            message: '알림을 가져왔습니다.',
            data: { notifications: notificationsResult.rows },
        });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};