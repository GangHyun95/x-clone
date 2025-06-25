import type { InfiniteData } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';
import type { Post, PostsResponse } from '@/types/post';
import type { User, UserSummary } from '@/types/user';

export function updatePostCacheById(postId: number, updater: (post: Post) => Post) {
    queryClient.setQueriesData<InfiniteData<PostsResponse>>({ queryKey: ['posts']}, (old) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map(page => ({
                ...page,
                posts: page.posts.map(p => p.id === postId ? updater(p) : p),
            })),
        }
    });
}

export function updatePostDetailCache(postId: number, updater: (post: Post) => Post) {
    queryClient.setQueryData<Post>(['post', postId], (old) => {
        if (!old) return old;
        return updater(old);
    });
}

export function updatePostCacheByUserId(userId: number, updater: (post: Post) => Post) {
    queryClient.setQueriesData<InfiniteData<PostsResponse>>({ queryKey: ['posts'] }, (old) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map(page => ({
                ...page,
                posts: page.posts.map(p => p.user.id === userId ? updater(p) : p),
            })),
        };
    });
}

export function prependPostToCache(newPost: Post) {
    queryClient.setQueriesData<InfiniteData<PostsResponse>>({ queryKey: ['posts']}, (old) => {
        if (!old) return old;
        const [first, ...rest] = old.pages;
        const updatedFirst = { ...first, posts: [newPost, ...first.posts] };
        
        return { ...old, pages: [updatedFirst, ...rest] };
    });
}

export function prependCommentToCache(postId: number, newComment: Post) {
    queryClient.setQueryData<InfiniteData<PostsResponse>>(['posts', 'children', postId], (old) => {
        if (!old) return old;
        const [first, ...rest] = old.pages;
        const updatedFirst = { ...first, posts: [newComment, ...first.posts] };
        return { ...old, pages: [updatedFirst, ...rest] };
    });
}

export function removePostFromCache(postId: number) {
    queryClient.setQueriesData<InfiniteData<PostsResponse>>({ queryKey: ['posts'] }, (old) => {
        if (!old) return old;
        return {
            ...old,
            pages: old.pages.map(page => ({
                ...page,
                posts: page.posts.filter(p => p.id !== postId),
            })),
        }
    });
}

export function updateFollowCache(userId: number, username: string, isNowFollowing: boolean) {
    queryClient.setQueriesData<UserSummary[]>({ queryKey: ['users'] }, (old) => {
        if (!old) return old;
        return old.map((user) =>
            user.id === userId
                ? { ...user, is_following: isNowFollowing }
                : user
        );
    });

    queryClient.setQueryData<User>(['user', username], (old) => {
        if (!old || old.id !== userId) return old;
        return {
            ...old,
            is_following: isNowFollowing,
            status: {
                ...old.status,
                follower: Math.max(0, old.status.follower + (isNowFollowing ? 1 : -1)),
            },
        };
    });

    queryClient.setQueryData<User>(['me'], (old) => {
        if (!old) return old;
        return {
            ...old,
            status: {
                ...old.status,
                following: Math.max(0, old.status.following + (isNowFollowing ? 1 : -1)),
            },
        };
    });
}

export function updateMeCache(updated: Partial<User>) {
    queryClient.setQueryData<User>(['me'], (old) => {
        if (!old) return old;
        return {
            ...old,
            ...updated,
        };
    });
}
