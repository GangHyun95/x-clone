
import type { Post } from '@/types/post';
import type { User, UserSummary } from '@/types/user';

import { get, patchFormData, post } from './api/client';

export async function getMe() {
    return get<{ user: User }>('/api/users/me', { withAuth: true });
}

export async function getSuggestedUsers(nickname?: string) {
    return get<{ users: UserSummary[] }>(`/api/users/suggested${nickname ? `?exclude=${encodeURIComponent(nickname)}` : ''}`, { withAuth: true });
}

export async function getUserProfile(nickname: string) {
    return get<{ user: User }>(`/api/users/profile/${nickname}`, { withAuth: true });
}

export async function getUserPosts(nickname: string) {
    return get<{ posts: Post[] }>(`/api/users/${nickname}/posts`, { withAuth: true });
}

export async function toggleFollow(payload: { userId: number }) {
    const { userId } = payload;
    return post<{ id: number }, { is_following: boolean }>(`/api/users/${userId}/follow`, { id: userId }, { withAuth: true });
}

export async function updateUserProfile(formData: FormData) {
    return patchFormData<{ user: User}>('/api/users/me', formData, { withAuth: true });
}

