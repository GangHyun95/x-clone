import { useMutation, useQuery } from '@tanstack/react-query';

import {
    getSuggestedUsers,
    getUserProfile,
    toggleFollow,
} from '@/service/user';

export function useSuggestedUsers(nickname?: string) {
    const excluded = nickname ?? 'default'
    return useQuery({
        queryKey: ['users', 'suggested', excluded],
        queryFn: async () => {
            const res = await getSuggestedUsers(excluded);
            return res.data.users;
        },
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export function useUserProfile(nickname: string) {
    return useQuery({
        queryKey: ['user', nickname],
        queryFn: async () => {
            const res = await getUserProfile(nickname);
            return res.data.user;
        },
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!nickname,
    });
}

export function useToggleFollow() {
    return useMutation({
        mutationFn: toggleFollow,
    });
}
