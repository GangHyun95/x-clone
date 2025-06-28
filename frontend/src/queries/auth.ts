import { useQuery } from '@tanstack/react-query';

import { getGoogleClientId, refreshAccessToken } from '@/service/auth';
import { getMe } from '@/service/user';

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
        refetchOnWindowFocus: false,
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
        refetchOnWindowFocus: false,
    });
}

export function useGoogleClientId() {
    return useQuery({
        queryKey: ['google-client-id'],
        queryFn: async () => {
            const res = await getGoogleClientId();
            return res.data.googleClientId;
        },
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnWindowFocus: false,
        retry: false,
    })
}