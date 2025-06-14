import jwt from 'jsonwebtoken';

import cloudinary from './cloudinary.ts';
import type { User, UserSummary } from '../types/user.ts';

export const generateToken = (
    id: string,
    type: 'access' | 'refresh'
): string => {
    const secret =
        type === 'access'
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
        throw new Error(
            `throw new Error('${type} token secret is not defined');`
        );
    }

    const expiresIn = type === 'access' ? '1h' : '7d';

    return jwt.sign({ id }, secret, {
        expiresIn,
    });
};

export const buildUserSummary = (user: User): UserSummary => {
    return {
        id: user.id,
        nickname: user.nickname,
        full_name: user.full_name,
        email: user.email,
        profile_img: user.profile_img,
    }
};

export const buildUserDetail = (user: User): User => ({
    id: user.id,
    nickname: user.nickname,
    full_name: user.full_name,
    email: user.email,
    profile_img: user.profile_img,
    cover_img: user.cover_img,
    bio: user.bio,
    link: user.link,
    created_at: user.created_at,
    status: user.status,
    post_count: user.post_count,
    is_following: user.is_following,
});

export const uploadAndReplaceImage = async (
    oldImageUrl: string | null,
    filePath: string
): Promise<string> => {
    if (oldImageUrl) {
        await deleteImage(oldImageUrl);
    }

    try {
        const uploaded = await cloudinary.uploader.upload(filePath);
        return uploaded.secure_url;
    } catch (error) {
        console.error('Cloudinary 이미지 업로드 실패:', error);
        throw new Error('이미지 업로드에 실패했습니다.');
    }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
    const publicId = imageUrl.split('/').pop()?.split('.')[0] ?? '';

    if (!publicId) {
        console.warn('Cloudinary 삭제: publicId를 찾을 수 없습니다.');
        return;
    }
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary 이미지 삭제 완료: ${publicId}`);
    } catch (error) {
        console.error('Cloudinary 이미지 삭제 실패:', error);
    }
};

export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
