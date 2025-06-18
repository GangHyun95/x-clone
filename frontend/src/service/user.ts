
import type { Post } from '@/types/post';
import type { UpdatePasswordPayload, User, UserSummary } from '@/types/user';

import { get, patch, patchFormData, post } from './api/client';

export async function getMe() {
    return get<{ user: User }>('/api/users/me', { withAuth: true });
}

export async function updateUsername(username: string) {
    return patch<{ username: string }, { username: string }>('/api/users/me/username', { username }, { withAuth: true })
};

export async function updatePassword(payload: UpdatePasswordPayload) {
    return patch<UpdatePasswordPayload, void>('/api/users/me/password', payload, { withAuth: true })
};

export async function deleteAccount(payload: { password: string }) {
    return post<{ password: string }, void>('/api/users/me/delete', payload, { withAuth: true })
};

export async function getSuggestedUsers(username?: string) {
    return get<{ users: UserSummary[] }>(`/api/users/suggested${username ? `?exclude=${encodeURIComponent(username)}` : ''}`, { withAuth: true });
}

export async function getProfile(username: string) {
    return get<{ user: User }>(`/api/users/profile/${username}`, { withAuth: true });
}

export async function getPosts(username: string) {
    return get<{ posts: Post[] }>(`/api/users/${username}/posts`, { withAuth: true });
}

export async function toggleFollow(payload: { userId: number }) {
    const { userId } = payload;
    return post<{ id: number }, { is_following: boolean }>(`/api/users/${userId}/follow`, { id: userId }, { withAuth: true });
}

export async function updateProfile(formData: FormData) {
    return patchFormData<{ user: User}>('/api/users/me', formData, { withAuth: true });
}

