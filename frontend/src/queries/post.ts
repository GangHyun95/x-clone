import { useMutation, useQuery } from '@tanstack/react-query';

import { createPost, deletePost, getAllPosts, getBookmarkedPosts, getFollowingPosts, toggleBookmark, toggleLike } from '@/service/post';

export function useCreatePost() {
    return useMutation({
        mutationFn: createPost,
    });
}

export function usePosts(tab: 'foryou' | 'following') {
    const key = tab === 'following' ? 'following' : 'all';
    return useQuery({
        queryKey: ['posts', key],
        queryFn: tab === 'following' ? getFollowingPosts : getAllPosts,
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}

export function useBookmarkedPost(keyword?: string) {
    const isSearch = !!keyword?.trim();

    return useQuery({
        queryKey: ['posts', 'bookmarks', keyword?.trim() || ''],
        queryFn: () => getBookmarkedPosts(keyword),
        staleTime: isSearch ? 0 : 1000 * 60 * 5,
        gcTime: isSearch ? 0 : 1000 * 60 * 10,
        retry: false,
    });
}

export function useToggleLike() {
    return useMutation({
        mutationFn: toggleLike,
    });
}

export function useToggleBookmark() {
    return useMutation({
        mutationFn: toggleBookmark,
    })
}

export function useDeletePost() {
    return useMutation({
        mutationFn: deletePost,
    })
}

