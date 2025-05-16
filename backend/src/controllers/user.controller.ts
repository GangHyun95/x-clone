import { buildUserResponse } from '../../lib/util.ts';
import Notification from '../models/notification.model.ts';
import User from '../models/user.model.ts';
import type { Request, Response } from 'express';

export const getUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { nickname } = req.params;
    try {
        const user = await User.findOne({ nickname });
        if (!user) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }
        res.status(200).json({
            success: true,
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error('Error in getUserProfile:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const followUnfollowUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');

        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser)
            throw new Error('사용자를 찾을 수 없습니다.');

        if (id === req.user._id.toString()) {
            res.status(400).json({
                success: false,
                message: '자기 자신을 팔로우할 수 없습니다.',
            });
            return;
        }

        if (!userToModify || !currentUser) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
        }
        const isFollowing = currentUser.following.some(
            (followedId) => followedId.toString() === id
        );

        if (isFollowing) {
            await User.findByIdAndUpdate(id, {
                $pull: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $pull: { following: id },
            });

            const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: userToModify._id,
            });
            await newNotification.save();

            res.status(200).json({
                success: true,
                message: '언팔로우 되었습니다.',
            });
        } else {
            await User.findByIdAndUpdate(id, {
                $push: { followers: req.user._id },
            });
            await User.findByIdAndUpdate(req.user._id, {
                $push: { following: id },
            });

            const newNotification = new Notification({
                type: 'follow',
                from: req.user._id,
                to: id,
            });
            await newNotification.save();

            res.status(200).json({
                success: true,
                message: '팔로우 되었습니다.',
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
