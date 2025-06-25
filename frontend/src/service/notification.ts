import { get } from '@/service/api/client';
import type { NotificationsResponse } from '@/types/notification';
import type { Cursor } from '@/types/post';

export async function getNotifications(type: 'like' | 'follow' | 'all' = 'all', cursor?: Cursor) {
    const searchParams = new URLSearchParams();

    if (type !== 'all') {
        searchParams.set('type', type);
    }
    
    if (cursor) {
        searchParams.set('cursorDate', cursor.cursorDate);
        searchParams.set('cursorId', cursor.cursorId.toString());
    }

    const res = await get<NotificationsResponse>(`/api/notifications?${searchParams}`, { withAuth: true});

    return res.data;
}