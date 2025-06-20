import { useMutation, useQuery } from '@tanstack/react-query';

import { createPost, deletePost, getPostOne, getPostsAll, getPostsBookmarked, getPostsFromFollowing, togglePostBookmark, togglePostLike,  } from '@/service/post';

export function useCreate() {
    return useMutation({
        mutationFn: createPost,
    });
}

export function usePosts(tab: 'foryou' | 'following') {
    const key = tab === 'following' ? 'following' : 'all';
    return useQuery({
        queryKey: ['posts', key],
        queryFn: tab === 'following' ? getPostsFromFollowing : getPostsAll,
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}

export function usePost(postId: number) {
    return useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostOne(postId),
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}

export function useBookmarked(keyword?: string) {
    const isSearch = !!keyword?.trim();

    return useQuery({
        queryKey: ['posts', 'bookmarks', keyword?.trim() || ''],
        queryFn: () => getPostsBookmarked(keyword),
        staleTime: isSearch ? 0 : 1000 * 60 * 5,
        gcTime: isSearch ? 0 : 1000 * 60 * 10,
        retry: false,
    });
}

export function useToggleLike() {
    return useMutation({
        mutationFn: togglePostLike,
    });
}

export function useToggleBookmark() {
    return useMutation({
        mutationFn: togglePostBookmark,
    })
}

export function useDelete() {
    return useMutation({
        mutationFn: deletePost,
    })
}

