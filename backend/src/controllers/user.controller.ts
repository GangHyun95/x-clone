import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import Notification from '../models/notification.model.ts';
import User from '../models/user.model.ts';
import { buildUserResponse, uploadAndReplaceImage } from '../lib/util.ts';

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
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
            data: {
                user: buildUserResponse(user),
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

export const followUnfollowUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    
    try {
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (!userToModify || !currentUser) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

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
        const isFollowing = currentUser.following.some((followedId) =>
            followedId.equals(id)
        );

        if (isFollowing) {
            await Promise.all([
                User.findByIdAndUpdate(id, {
                    $pull: { followers: req.user._id },
                }),
                User.findByIdAndUpdate(req.user._id, {
                    $pull: { following: id },
                }),
            ]);

            res.status(200).json({
                success: true,
                message: '언팔로우 되었습니다.',
                data: {},
            });
        } else {
            await Promise.all([
                User.findByIdAndUpdate(id, {
                    $push: { followers: req.user._id },
                }),
                User.findByIdAndUpdate(req.user._id, {
                    $push: { following: id },
                }),
                new Notification({
                    type: 'follow',
                    from: req.user._id,
                    to: id,
                }).save(),
            ]);

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
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    try {
        const usersFollowedByMe = await User.findById(req.user._id).select(
            'following'
        );

        const users = await User.aggregate([
            {
                $match: {
                    _id: { $ne: req.user._id },
                },
            },
            { $sample: { size: 10 } },
        ]);

        const filteredUsers = users.filter(
            (user) => !usersFollowedByMe?.following.includes(user._id)
        );
        const suggestedUsers = filteredUsers.slice(0, 4);

        res.status(200).json({
            success: true,
            data: {
                users: suggestedUsers.map((user) => buildUserResponse(user)),
            }
        });
    } catch (error) {
        console.error('Error in getSuggestedUsers:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
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
        const existingUser = await User.findOne({ nickname });
        if (existingUser) {
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
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');

    const {
        fullName,
        nickname,
        currentPassword,
        newPassword,
        profileImg,
        coverImg,
        bio,
        link,
    } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        if (
            (currentPassword && !newPassword) ||
            (!currentPassword && newPassword)
        ) {
            res.status(400).json({
                success: false,
                message: '비밀번호를 모두 입력해 주세요.',
            });
            return;
        }

        if (currentPassword && newPassword) {
            if (!user.password)
                throw new Error('비밀번호가 설정되어 있지 않은 계정입니다');

            const isMatch = await bcrypt.compare(
                currentPassword,
                user.password
            );
            if (!isMatch) {
                res.status(401).json({
                    success: false,
                    message: '현재 비밀번호가 일치하지 않습니다.',
                });
                return;
            }

            if (newPassword.length < 6) {
                res.status(400).json({
                    success: false,
                    message: '비밀번호는 최소 6자 이상이어야 합니다.',
                });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            user.profileImg = await uploadAndReplaceImage(
                user.profileImg ?? null,
                profileImg
            );
        }

        if (coverImg) {
            user.coverImg = await uploadAndReplaceImage(
                user.coverImg ?? null,
                coverImg
            );
        }

        if (nickname && nickname !== user.nickname) {
            const existingUser = await User.findOne({ nickname });
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    message: '이미 사용중인 닉네임입니다.',
                });
                return;
            }
            user.nickname = nickname;
        }

        user.fullName = fullName || user.fullName;
        user.bio = bio || user.bio;
        user.link = link || user.link;

        await user.save();

        res.status(200).json({
            success: true,
            message: '프로필이 업데이트 되었습니다.',
            data: {
                user: buildUserResponse(user),
            }
        });
    } catch (error) {
        console.error('Error in updateUserProfile:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        await Promise.all([
            User.updateMany(
                { followers: req.user._id },
                { $pull: { followers: req.user._id } }
            ),
            User.updateMany(
                { following: req.user._id },
                { $pull: { following: req.user._id } }
            ),
        ]);

        await User.findByIdAndDelete(req.user._id);

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
