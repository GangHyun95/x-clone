import jwt from 'jsonwebtoken';

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
        username: user.username,
        full_name: user.full_name,
        email: user.email,
        profile_img: user.profile_img,
        bio: user.bio,
        is_following: user.is_following,
    }
};

export const buildUserDetail = (user: User): User => ({
    id: user.id,
    username: user.username,
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

export const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export function getTweetLength(text: string): number {
    let length = 0;
    for (const char of Array.from(text)) {
        const code = char.codePointAt(0) ?? 0;

        if (
            code > 0x1F000 ||
            (code >= 0x1100 && code <= 0x11FF) ||
            (code >= 0x3130 && code <= 0x318F) ||
            (code >= 0xAC00 && code <= 0xD7A3) ||
            (code >= 0x4E00 && code <= 0x9FFF) ||
            (code >= 0x2000 && code <= 0x206F)
        ) {
            length += 2;
        } else {
            length += 1;
        }
    }
    return length;
}
