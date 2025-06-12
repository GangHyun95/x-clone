import { get } from '@/service/api/client';
import type { Notification } from '@/types/notification';

export async function getNotifications(type?: 'like' | 'follow' | 'all') {
    const query = type && type !== 'all' ? `?type=${type}` : '';
    const res = await get<{ notifications: Notification[] }>(`/api/notifications${query}`, { withAuth: true});

    return res.data.notifications;
}