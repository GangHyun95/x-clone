import jwt from 'jsonwebtoken';

import cloudinary from './cloudinary.ts';
import type { IUser } from '../models/user.ts';

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

export const buildUserResponse = (user: IUser): IUser => {
    return {
        id: user.id,
        full_name: user.full_name,
        nickname: user.nickname,
        email: user.email,
        profile_img: user.profile_img,
        cover_img: user.cover_img,
        bio: user.bio,
        link: user.link,
        created_at: user.created_at,
        updated_at: user.updated_at,
    };
};

export const uploadAndReplaceImage = async (
    oldImageUrl: string | null,
    newBase64: string
): Promise<string> => {
    if (oldImageUrl) {
        await deleteImage(oldImageUrl);
    }

    try {
        const uploaded = await cloudinary.uploader.upload(newBase64);
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
