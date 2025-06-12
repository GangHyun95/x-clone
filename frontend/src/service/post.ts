import type { Post } from '@/types/post';

import { del, get, post, postFormData, type ApiResponse } from './api/client';

export async function getAllPosts() {
    const res = await get<{ posts: Post[] }>('/api/posts/', { withAuth: true });

    return res.data.posts;
}

export async function getFollowingPosts() {
    const res = await get<{ posts: Post[] }>('/api/posts/following', { withAuth: true });

    return res.data.posts;
}

export async function getBookmarkedPosts(q?: string) {
    const query = q?.trim() ? `?q=${encodeURIComponent(q)}` : '';
    const res = await get<{ posts: Post[] }>(`/api/posts/bookmarks${query}`, { withAuth: true });
    console.log(res.data);
    return res.data.posts;
}


export async function createPost(formData: FormData) {
    const res = await postFormData<{ post: Post }>('/api/posts', formData, { withAuth: true });
    return res.data.post;
}

export async function deletePost(payload: { postId: number }): Promise<ApiResponse<void>> {
    const { postId } = payload;
    return del<void>(`/api/posts/${postId}`, { withAuth: true });
}

export async function toggleLike(payload: { postId: number }) {
    const { postId } = payload;
    return post<{ id: number }, void>(`/api/posts/${postId}/like`, { id: postId }, { withAuth: true });
}

export async function toggleBookmark(payload: { postId: number }) {
    const { postId } = payload;
    return post<{ id: number }, void>(`/api/posts/${postId}/bookmark`, { id: postId }, { withAuth: true });
}
