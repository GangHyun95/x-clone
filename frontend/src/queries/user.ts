import { useMutation, useQuery } from '@tanstack/react-query';

import { getLikedPosts } from '@/service/post';
import {
    getSuggestedUsers,
    getUserPosts,
    getUserProfile,
    toggleFollow,
    updateUserProfile,
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

export function useUserProfile(nickname: string, options?: { enabled?: boolean }) {
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
        enabled: !!nickname && (options?.enabled ?? true),
    });
}

export function useUserPosts(nickname: string, tab: 'post' | 'like') {
    const key = tab === 'like' ? 'like' : 'post';
    return useQuery({
        queryKey: ['posts', nickname, key],
        queryFn: async () => {
            const res = tab === 'like' ? await getLikedPosts(nickname) : await getUserPosts(nickname);
            return res.data.posts;
        },
        enabled: !!nickname,
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
        refetchOnWindowFocus: false,
    });
}

export function useToggleFollow() {
    return useMutation({
        mutationFn: toggleFollow,
    });
}

export function useUpdateProfile() {
    return useMutation({
        mutationFn: updateUserProfile,
    })
}