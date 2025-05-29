import type { Request, Response } from 'express';

import { deleteImage, uploadAndReplaceImage } from '@/lib/util.ts';
import Notification from '@/models/notification.model.ts';
import Post from '@/models/post.model.ts';
import User from '@/models/user.model.ts';

export const createPost = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    const { text, img } = req.body;

    if (!text && !img) {
        res.status(400).json({
            success: false,
            message: '텍스트 또는 이미지를 입력해야 합니다.',
        });
        return;
    }

    try {
        let uploadImgUrl = null;

        const user = await User.findById(req.user._id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        if (img) {
            uploadImgUrl = await uploadAndReplaceImage(null, img);
        }

        const newPost = new Post({
            user: req.user._id,
            text,
            img: uploadImgUrl,
        });

        await newPost.save();

        res.status(201).json({
            success: true,
            message: '게시물이 생성되었습니다.',
            data: { post: newPost },
        });
    } catch (error) {
        console.error('Error in createPost controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const editPost = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    const { id } = req.params;
    const { text, img } = req.body;

    if (!text && !img) {
        res.status(400).json({
            success: false,
            message: '텍스트 또는 이미지를 입력해야 합니다.',
        });
        return;
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({
                success: false,
                message: '게시물을 찾을 수 없습니다.',
            });
            return;
        }

        if (!post.user.equals(req.user._id)) {
            res.status(403).json({
                success: false,
                message: '게시물 수정 권한이 없습니다.',
            });
            return;
        }

        if (img === null || img === '') {
            if (post.img) {
                await deleteImage(post.img);
                post.img = null;
            }
        } else if (img) {
            post.img = await uploadAndReplaceImage(post.img ?? null, img);
        }
        if (text) post.text = text;

        await post.save();

        res.status(200).json({
            success: true,
            message: '게시물이 수정되었습니다.',
            data: { post },
        });
    } catch (error) {
        console.error('Error in editPost controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({
                success: false,
                message: '게시물을 찾을 수 없습니다.',
            });
            return;
        }

        if (!post.user.equals(req.user._id)) {
            res.status(403).json({
                success: false,
                message: '게시물 삭제 권한이 없습니다.',
            });
            return;
        }
        if (post.img) {
            await deleteImage(post.img);
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: '게시물이 삭제되었습니다.',
            data: {},
        });
    } catch (error) {
        console.error('Error in deletePost controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const commentOnPost = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    const { text } = req.body;
    const { id } = req.params;

    if (!text) {
        res.status(400).json({
            success: false,
            message: '댓글을 입력해야 합니다.',
        });
        return;
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { $push: { comments: { user: req.user._id, text } } },
            { new: true }
        );

        if (!updatedPost) {
            res.status(404).json({
                success: false,
                message: '게시물을 찾을 수 없습니다.',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: '댓글이 작성되었습니다.',
            data: { post: updatedPost },
        });
    } catch (error) {
        console.error('Error in commentOnPost controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const likeUnlikePost = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({
                success: false,
                message: '게시물을 찾을 수 없습니다.',
            });
            return;
        }

        const userLikedPost = post.likes.some((likeId) =>
            likeId.equals(req.user?._id)
        );

        if (userLikedPost) {
            await Promise.all([
                Post.updateOne({ _id: id }, { $pull: { likes: req.user._id } }),
                User.updateOne(
                    { _id: req.user._id },
                    { $pull: { likedPosts: id } }
                ),
            ]);

            res.status(200).json({
                success: true,
                message: '게시물의 좋아요가 취소되었습니다.',
                data: {},
            });
        } else {
            await Promise.all([
                Post.updateOne({ _id: id }, { $push: { likes: req.user._id } }),
                User.updateOne(
                    { _id: req.user._id },
                    { $push: { likedPosts: id } }
                ),
            ]);

            const notification = new Notification({
                from: req.user._id,
                to: post.user,
                type: 'like',
            });

            await notification.save();

            res.status(200).json({
                success: true,
                message: '게시물에 좋아요가 추가되었습니다.',
                data: {},
            });
        }
    } catch (error) {
        console.error('Error in likeUnlikePost controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getAllPosts = async (req: Request, res: Response): Promise<void> => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate('comments.user', '-password');

        res.status(200).json({
            success: true,
            message: posts.length
                ? '게시물 목록을 가져왔습니다.'
                : '게시물이 없습니다.',
            data: { posts },
        });
    } catch (error) {
        console.error('Error in getAllPosts controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getLikedPosts = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }
        const likedPosts = await Post.find({
            _id: { $in: user.likedPosts },
        })
            .populate('user', '-password')
            .populate('comments.user', '-password');

        res.status(200).json({
            success: true,
            message: likedPosts.length
                ? '좋아요한 게시물을 가져왔습니다.'
                : '좋아요한 게시물이 없습니다.',
            data: { posts: likedPosts },
        });
    } catch (error) {
        console.error('Error in getLikedPosts controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getFollowingPosts = async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');

    try {
        const user = await User.findById(req.user._id).select('following');
        if (!user) {
            res.status(404).json({
                success: false,
                message: '사용자를 찾을 수 없습니다.',
            });
            return;
        }

        const following = user.following;

        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate('comments.user', '-password');

        res.status(200).json({
            success: true,
            message: feedPosts.length
                ? '피드를 가져왔습니다.'
                : '팔로우한 사용자의 게시물이 없습니다.',
            data: { posts: feedPosts },
        });
    } catch (error) {
        console.error('Error in getFollowingPosts controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const getUserPosts = async (req: Request, res: Response): Promise<void> => {
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
        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate('user', '-password')
            .populate('comments.user', '-password');

        res.status(200).json({
            success: true,
            message: posts.length
                ? '게시물 목록을 가져왔습니다.'
                : '게시물이 없습니다.',
            data: { posts },
        });
    } catch (error) {
        console.error('Error in getUserPosts controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};
