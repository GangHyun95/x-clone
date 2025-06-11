import type { UserPreview } from '@/types/user';

import { get, post } from './api/client';

export async function getMe() {
    return get<{ user: UserPreview }>('/api/users/me', { withAuth: true });
}
export async function getSuggestedUsers() {
    return get<{ users: UserPreview[] }>('/api/users/suggested', { withAuth: true });
}

export async function getUserProfile(nickname: string) {
    return get<{ user: UserPreview }>(`/api/users/${nickname}`, { withAuth: true });
}

export async function toggleFollow(payload: { userId: number }) {
    const { userId } = payload;
    return post<{ id: number }, void>(`/api/users/${userId}/follow`, { id: userId }, { withAuth: true });
}
