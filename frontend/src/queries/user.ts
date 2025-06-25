import { useMutation, useQuery } from '@tanstack/react-query';
import {
    getProfile,
    getSuggestedUsers,
    toggleFollow,
    updateUsername,
    updateProfile,
    getRecommended,
    getFollowers,
    getFollowing,
} from '@/service/user';

export function useSuggested(username?: string) {
    const excluded = username ?? 'default'
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

export function useListByType(type: 'suggest' | 'follower' | 'following', username: string) {
    const key = type ?? 'suggest';

    const queryFn =
        key === 'suggest'
            ? getRecommended
            : key === 'follower'
            ? () => getFollowers(username)
            : () => getFollowing(username);

    return useQuery({
        queryKey: ['users', key, username],
        queryFn: async () => {
            const res = await queryFn();
            return res.data.users;
        },
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export function useProfile(username: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['user', username],
        queryFn: async () => {
            const res = await getProfile(username);
            return res.data.user;
        },
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!username && (options?.enabled ?? true),
    });
}

export function useToggleFollow() {
    return useMutation({
        mutationFn: toggleFollow,
    });
}

export function useUpdateProfile() {
    return useMutation({
        mutationFn: updateProfile,
    })
}

export function useUpdateUsername() {
    return useMutation({
        mutationFn: updateUsername,
    })
}