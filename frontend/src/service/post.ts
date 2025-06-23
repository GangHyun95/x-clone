import type { Post } from '@/types/post';

import { del, get, post, postFormData } from './api/client';

export async function getPostsAll() {
    const res = await get<{ posts: Post[] }>('/api/posts/', { withAuth: true });

    return res.data.posts;
}

export async function getPostsByParentId(postId: number) {
    const res = await get<{ posts: Post[] }>(`/api/posts?parentId=${postId}`, { withAuth: true });
    return res.data.posts;
}

export async function getPostOne(postId: number) {
    const res = await get<{ post: Post }>(`/api/posts/${postId}`, { withAuth: true });
    return res.data.post;
}

export async function getPostsFromFollowing() {
    const res = await get<{ posts: Post[] }>('/api/posts/following', { withAuth: true });

    return res.data.posts;
}

export async function getPostsBookmarked(q?: string) {
    const query = q?.trim() ? `?q=${encodeURIComponent(q)}` : '';
    const res = await get<{ posts: Post[] }>(`/api/posts/bookmarks${query}`, { withAuth: true });
    return res.data.posts;
}

export async function getPostsLikedByUsername(username: string) {
    return get<{ posts: Post[] }>(`/api/posts/likes/${encodeURIComponent(username)}`, { withAuth: true });
}

export async function createPost(formData: FormData) {
    const res = await postFormData<{ post: Post }>('/api/posts', formData, { withAuth: true });
    return res.data.post;
}

export async function deletePost(payload: { postId: number }) {
    const { postId } = payload;
    return del<void>(`/api/posts/${postId}`, { withAuth: true });
}

export async function togglePostLike(payload: { postId: number }) {
    const { postId } = payload;
    return post<{ id: number }, void>(`/api/posts/${postId}/like`, { id: postId }, { withAuth: true });
}

export async function togglePostBookmark(payload: { postId: number }) {
    const { postId } = payload;
    return post<{ id: number }, void>(`/api/posts/${postId}/bookmark`, { id: postId }, { withAuth: true });
}
