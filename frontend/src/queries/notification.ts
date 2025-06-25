import { useInfiniteQuery } from '@tanstack/react-query';

import { getNotifications } from '@/service/notification';
import type { Cursor } from '@/types/post';

export function useNotifications(tab?: 'like' | 'follow' | 'all') {
    const key = tab === 'like' || tab === 'follow' ? tab : 'all';
    return useInfiniteQuery({
        queryKey: ['notifications', key],
        queryFn: ({ pageParam }) => getNotifications(tab, pageParam),
        initialPageParam: null as Cursor,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
        staleTime: 1000 * 60 * 5,
        gcTime:    1000 * 60 * 10,
        retry: false,
    });
}
