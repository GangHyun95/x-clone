import { useMutation, useQuery } from '@tanstack/react-query';

import { createPost, getAllPosts, likeUnlikePost } from '@/service/post';

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

export function useLikeUnlikePost() {
    return useMutation({
        mutationFn: likeUnlikePost,
    });
}
