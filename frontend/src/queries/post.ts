import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import { createPost, deletePost, getPostOne, getPostsAll, getPostsBookmarked, getPostsByParentId, getPostsByUsername, getPostsFromFollowing, getPostsLiked, togglePostBookmark, togglePostLike,  } from '@/service/post';
import type { Cursor } from '@/types/post';


export function useCreate() {
    return useMutation({
        mutationFn: createPost
    });
}

export function usePosts(tab: 'foryou' | 'following') {
    const key = tab === 'following' ? 'following' : 'all';

    return useInfiniteQuery({
        queryKey: ['posts', key],
        queryFn: ({ pageParam }) => {
            if (tab === 'following') return getPostsFromFollowing(pageParam);
            return getPostsAll(pageParam);
        },
        initialPageParam: null as Cursor,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}

export function useChildrenPosts(postId: number) {
    return useInfiniteQuery({
        queryKey: ['posts', 'children', postId],
        queryFn: ({ pageParam }) => getPostsByParentId(postId, pageParam),
        initialPageParam: null as Cursor,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
        staleTime: 1000 * 60 * 5,
        gcTime:    1000 * 60 * 10,
        retry: false,
    });
}

export function useBookmarked(keyword?: string) {
    const trimmed = keyword?.trim() || '';
    const isSearch = !!trimmed;

    return useInfiniteQuery({
        queryKey: ['posts', 'bookmarks', trimmed],
        queryFn: ({ pageParam }) => getPostsBookmarked(trimmed, pageParam),
        initialPageParam: null as Cursor,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
        staleTime: isSearch ? 0 : 1000 * 60 * 5,
        gcTime:    isSearch ? 0 : 1000 * 60 * 10,
        retry: false,
    });
}

export function useUserPosts(username: string, tab: 'post' | 'like') {
    const key = tab === 'like' ? 'like' : 'post';

    return useInfiniteQuery({
        queryKey: ['posts', username, key],
        queryFn: ({ pageParam }) =>
            tab === 'like'
                ? getPostsLiked(username, pageParam)
                : getPostsByUsername(username, pageParam),
        initialPageParam: null as Cursor,
        getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextCursor : undefined,
        enabled: !!username,
        staleTime: 1000 * 60 * 50,
        gcTime:    1000 * 60 * 60,
        retry: false,
        refetchOnWindowFocus: false,
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

