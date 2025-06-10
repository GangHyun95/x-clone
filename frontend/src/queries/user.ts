import { useQuery } from '@tanstack/react-query';

import { getSuggestedUsers, getUserProfile } from '@/service/user';

export function useSuggestedUsers() {
    return useQuery({
        queryKey: ['users', 'suggested'],
        queryFn: async () => {
            const res = await getSuggestedUsers();
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
