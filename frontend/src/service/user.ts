import { getAccessToken } from '@/store/authStore';
import type { UserPreview } from '@/types/user';

import { get, post } from './api/client';

export async function getMe() {
    const token = getAccessToken();
    return get<{ user: UserPreview }>('/api/users/me', {
        headers: {
            Authorization: `Bearer ${token ?? ''}`,
        },
    });
}
export async function getSuggestedUsers() {
    const token = getAccessToken();
    return get<{ users: UserPreview[] }>('/api/users/suggested', {
        headers: {
            Authorization: `Bearer ${token ?? ''}`,
        },
    });
}

export async function getUserProfile(nickname: string) {
    const token = getAccessToken();
    return get<{ user: UserPreview }>(`/api/users/${nickname}`, {
        headers: {
            Authorization: `Bearer ${token ?? ''}`,
        },
    });
}

export async function toggleFollow(payload: { id: number }) {
    const token = getAccessToken();
    const { id } = payload;
    return post<{ id: number }, void>(`/api/users/${id}/follow`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}
