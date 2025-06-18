
import type { Post } from '@/types/post';
import type { UpdatePasswordPayload, User, UserSummary } from '@/types/user';

import { del, get, patch, patchFormData, post } from './api/client';

export async function getMe() {
    return get<{ user: User }>('/api/users/me', { withAuth: true });
}

export async function updateNickname(nickname: string) {
    return patch<{ nickname: string }, { nickname: string }>('/api/users/me/nickname', { nickname }, { withAuth: true })
};

export async function updatePassword(payload: UpdatePasswordPayload) {
    return patch<UpdatePasswordPayload, void>('/api/users/me/password', payload, { withAuth: true })
};

export async function deleteAccount() {
    return del<void>('/api/users/me', { withAuth: true })
};

export async function getSuggestedUsers(nickname?: string) {
    return get<{ users: UserSummary[] }>(`/api/users/suggested${nickname ? `?exclude=${encodeURIComponent(nickname)}` : ''}`, { withAuth: true });
}

export async function getProfile(nickname: string) {
    return get<{ user: User }>(`/api/users/profile/${nickname}`, { withAuth: true });
}

export async function getPosts(nickname: string) {
    return get<{ posts: Post[] }>(`/api/users/${nickname}/posts`, { withAuth: true });
}

export async function toggleFollow(payload: { userId: number }) {
    const { userId } = payload;
    return post<{ id: number }, { is_following: boolean }>(`/api/users/${userId}/follow`, { id: userId }, { withAuth: true });
}

export async function updateProfile(formData: FormData) {
    return patchFormData<{ user: User}>('/api/users/me', formData, { withAuth: true });
}

