import { getAccessToken } from '@/store/authStore';
import type { User } from '@/types/user';

import { get } from './api/client'

export async function getMe() {
    const token = getAccessToken();
    return get<{ user: User }>('/api/users/me', {
        headers: {
            Authorization: `Bearer ${token ?? ''}`,
        },
    });
}