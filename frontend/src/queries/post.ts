import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';

import { createPost, deletePost, getPostOne, getPostsAll, getPostsBookmarked, getPostsByParentId, getPostsFromFollowing, togglePostBookmark, togglePostLike,  } from '@/service/post';
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

export function usePost(postId: number) {
    return useQuery({
        queryKey: ['post', postId],
        queryFn: () => getPostOne(postId),
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}

export function useChildrenPosts(postId: number) {
    return useQuery({
        queryKey: ['posts', 'children', postId],
        queryFn: () => getPostsByParentId(postId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
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

