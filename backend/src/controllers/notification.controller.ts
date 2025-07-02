import type { Request, Response } from 'express';

import { pool } from '../lib/db/index.ts';
import { paginate } from '../lib/db/paginate.ts';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user.id;
    const type = req.query.type as string | undefined;
    const cursor =
        req.query.cursorDate && req.query.cursorId
            ? { cursorDate: new Date(req.query.cursorDate as string), cursorId: parseInt(req.query.cursorId as string, 10) }
            : null;

    try {
        const values: (number | string | Date)[] = [userId];
        let sql = `
            SELECT
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
                            'id', p.id,
                            'content', p.content,
                            'img', p.img
                        )
                        FROM posts p
                        WHERE p.id = n.post_id
                    )
                    ELSE NULL
                END AS post
            FROM notifications n
            JOIN users u ON u.id = n.from_user_id
            WHERE n.to_user_id = $1
        `;
        if (type) {
            if (type === 'like') {
                sql += ` AND n.type IN ('like','comment_like')`;
            } else {
                sql += ` AND n.type = $2`;
                values.push(type);
            }
        }

        await pool.query(
            `UPDATE notifications SET read = true WHERE to_user_id = $1`,
            [userId]
        );

        const { items: notifications, hasNextPage, nextCursor } = await paginate(sql, values, cursor, { order: ['n.created_at', 'n.id'] });


        res.status(200).json({
            success: true,
            message: '알림을 가져왔습니다.',
            data: { notifications, hasNextPage, nextCursor },
        });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
    }
};