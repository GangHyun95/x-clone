import { useMutation, useQuery } from '@tanstack/react-query';

import { getPostsLikedByNickname } from '@/service/post';
import {
    getPosts,
    getProfile,
    getSuggestedUsers,
    toggleFollow,
    updateNickname,
    updateProfile,
} from '@/service/user';

export function useSuggested(nickname?: string) {
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

export function useProfile(nickname: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['user', nickname],
        queryFn: async () => {
            const res = await getProfile(nickname);
            return res.data.user;
        },
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
        refetchOnWindowFocus: false,
        enabled: !!nickname && (options?.enabled ?? true),
    });
}

export function usePosts(nickname: string, tab: 'post' | 'like') {
    const key = tab === 'like' ? 'like' : 'post';
    return useQuery({
        queryKey: ['posts', nickname, key],
        queryFn: async () => {
            const res = tab === 'like' ? await getPostsLikedByNickname(nickname) : await getPosts(nickname);
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
        mutationFn: updateProfile,
    })
}

export function useUpdateNickname() {
    return useMutation({
        mutationFn: updateNickname,
    })
}