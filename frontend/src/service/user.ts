import { getAccessToken } from '@/store/authStore';
import type { UserPreview } from '@/types/user';

import { get } from './api/client';

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