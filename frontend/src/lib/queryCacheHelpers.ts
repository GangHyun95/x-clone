import { queryClient } from '@/lib/queryClient';
import type { Post } from '@/types/post';
import type { User, UserSummary } from '@/types/user';

export function updatePostCacheById(postId: number, updater: (post: Post) => Post) {
    queryClient.setQueriesData<Post[]>({ queryKey: ['posts']}, (old) => {
        if (!old) return old;
        return old.map((post) => post.id === postId ? updater(post) : post);
    });
}

export function updatePostDetailCache(postId: number, updater: (post: Post) => Post) {
    queryClient.setQueryData<Post>(['post', postId], (old) => {
        if (!old) return old;
        return updater(old);
    });
}

export function updatePostCacheByUserId(userId: number, updater: (post: Post) => Post) {
    queryClient.setQueriesData<Post[]>({ queryKey: ['posts']}, (old) => {
        if (!old) return old;
        return old.map((post) => post.user.id === userId ? updater(post) : post);
    });
}

export function prependPostToCache(newPost: Post) {
    queryClient.setQueriesData<Post[]>({ queryKey: ['posts']}, (old) => {
        if (!old) return [newPost];
        return [newPost, ...old];
    });
}

export function prependCommentToCache(postId: number, newComment: Post) {
    queryClient.setQueryData<Post[]>(['posts', 'children', postId], (old) => {
        if (!old) return [newComment];
        return [newComment, ...old];
    });
}


export function removePostFromCache(postId: number) {
    queryClient.setQueriesData<Post[]>({ queryKey: ['posts'] }, (old) => {
        if (!old) return old;
        return old.filter((post) => post.id !== postId);
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
