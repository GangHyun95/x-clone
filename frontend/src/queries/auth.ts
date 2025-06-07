import { useQuery } from '@tanstack/react-query';

import { getMe, refreshAccessToken } from '@/service/auth';

export function useCheckAuth() {
    return useQuery({
        queryKey: ['accessToken'],
        queryFn: async () => {
            const res = await refreshAccessToken();
            return res.data.accessToken;
        },
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}

export function useMe(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['me'],
        queryFn: async () => {
            const res = await getMe();
            return res.data.user;
        },
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
        enabled: options?.enabled ?? true,
    });
}
