import { queryClient } from '@/lib/queryClient';
import type { Post } from '@/types/post';

export function updatePostCacheById(postId: number, updater: (post: Post) => Post) {
    queryClient.setQueriesData<Post[]>({ queryKey: ['posts']}, (old) => {
        if (!old) return old;
        return old.map((post) => post.id === postId ? updater(post) : post);
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

export function removePostFromCache(postId: number) {
    queryClient.setQueriesData<Post[]>({ queryKey: ['posts']}, (old) => {
        if (!old) return old;
        return old.filter((post) => post.id !== postId);
    });
}
