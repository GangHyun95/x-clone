import type { Request, Response } from 'express';
import Post from '../models/post.model.ts';
import User from '../models/user.model.ts';
import { deleteImage, uploadAndReplaceImage } from '../lib/util.ts';
import Notification from '../models/notification.model.ts';

export const createPost = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');

        const { text, img } = req.body;

        if (!text && !img) {
            res.status(400).json({
                success: false,
                message: '텍스트 또는 이미지를 입력해야 합니다.',
            });
            return;
        }

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
            post: newPost,
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
    try {
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
            post,
        });
    } catch (error) {
        console.error('Error in editPost controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const deletePost = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        if (!req.user) throw new Error('사용자를 찾을 수 없습니다.');

        const { id } = req.params;

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
        });
    } catch (error) {
        console.error('Error in deletePost controller:', error);
        res.status(500).json({
            success: false,
            message: '서버 오류가 발생했습니다.',
        });
    }
};
