import { useQuery } from '@tanstack/react-query';

import { getNotifications } from '@/service/notification';

export function useNotifications(tab?: 'like' | 'follow' | 'all') {
    const key = tab === 'like' || tab === 'follow' ? tab : 'all';
    return useQuery({
        queryKey: ['notifications', key],
        queryFn: () => getNotifications(tab),
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}
