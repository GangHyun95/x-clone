import jwt from 'jsonwebtoken';
import type { IUser } from '../models/user.model.ts';
import cloudinary from './cloudinary.ts';

export const generateToken = (id: string, type: 'access' | 'refresh') => {
    const secret =
        type === 'access'
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
        throw new Error(
            `throw new Error('${type} token secret is not defined');`
        );
    }

    const expiresIn = type === 'access' ? '15m' : '1d';

    return jwt.sign({ id }, secret, {
        expiresIn,
    });
};

export const buildUserResponse = (user: IUser) => {
    return {
        _id: user._id,
        fullName: user.fullName,
        nickname: user.nickname,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link,
    };
};

export const uploadAndReplaceImage = async (
    oldImageUrl: string | null,
    newBase64: string
) => {
    if (oldImageUrl) await deleteImage(oldImageUrl);

    const uploaded = await cloudinary.uploader.upload(newBase64);
    return uploaded.secure_url;
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
    const publicId = imageUrl.split('/').pop()?.split('.')[0] ?? '';
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary 이미지 삭제 완료: ${publicId}`);
    } catch (error) {
        console.error('Cloudinary 이미지 삭제 실패:', error);
    }
};
