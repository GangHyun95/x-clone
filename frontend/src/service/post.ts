import { getAccessToken } from '@/store/authStore';

import type { Post } from '@/types/post';

import { get, post, postFormData } from './api/client';

export async function getAllPosts() {
    const token = getAccessToken();
    const res = await get<{ posts: Post[] }>('/api/posts/', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res.data.posts;
}

export async function createPost(formData: FormData) {
    const token = getAccessToken();
    const res = await postFormData<{ post: Post }>('/api/posts', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.post;
}

export async function likePost(payload: { id: number }) {
    const token = getAccessToken();
    const { id } = payload;
    return post<{ id: number }, void>(`/api/posts/${id}/like`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export async function bookmarkPost(payload: { id: number }) {
    const token = getAccessToken();
    const { id } = payload;
    return post<{ id: number }, void>(`/api/posts/${id}/bookmark`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}