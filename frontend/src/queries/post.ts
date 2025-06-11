import { useMutation, useQuery } from '@tanstack/react-query';

import { bookmarkPost, createPost, deletePost, getAllPosts, likePost } from '@/service/post';

export function useCreatePost() {
    return useMutation({
        mutationFn: createPost,
    });
}

export function usePosts() {
    return useQuery({
        queryKey: ['posts'],
        queryFn: getAllPosts,
        staleTime: 1000 * 60 * 50,
        gcTime: 1000 * 60 * 60,
        retry: false,
    });
}

export function useLikePost() {
    return useMutation({
        mutationFn: likePost,
    });
}

export function useDeletePost() {
    return useMutation({
        mutationFn: deletePost,
    })
}

export function useBookmarkPost() {
    return useMutation({
        mutationFn: bookmarkPost,
    })
    
}
