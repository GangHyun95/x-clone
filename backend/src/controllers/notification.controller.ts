import type { Request, Response } from 'express';
import Notification from '../models/notification.model.ts';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    try {
        const notifications = await Notification.find({
            to: req.user._id,
        }).populate('from', 'username profileImg');

        await Notification.updateMany(
            { to: req.user._id },
            { $set: { read: true } }
        );

        res.status(200).json({
            success: true,
            message: '알림을 가져왔습니다.',
            data: { notifications}
        });
    } catch (error) {
        console.error('Error in getNotifications:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const deleteNotifications = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    try {
        await Notification.deleteMany({ to: req.user._id });

        res.status(200).json({
            success: true,
            message: '알림을 삭제했습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in deleteNotifications:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            res.status(404).json({
                success: false,
                message: '알림을 찾을 수 없습니다.',
            });
            return;
        }

        if (!notification.to.equals(req.user._id)) {
            res.status(403).json({
                success: false,
                message: '권한이 없습니다.',
            });
            return;
        }

        await Notification.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: '알림을 삭제했습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in deleteNotification:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};
