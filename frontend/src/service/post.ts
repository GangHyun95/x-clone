import type { Cursor, Post, PostsResponse } from '@/types/post';

import { del, get, post, postFormData } from './api/client';

export async function getPostsAll(cursor?: Cursor) {
    const searchParams = new URLSearchParams();
    if (cursor) {
        searchParams.set('cursorDate', cursor.cursorDate);
        searchParams.set('cursorId', cursor.cursorId.toString());
    }

    const res = await get<PostsResponse>(`/api/posts/?${searchParams}`, {
        withAuth: true,
    });

    return res.data;
}

export async function getPostsFromFollowing(cursor?: Cursor) {
    const searchParams = new URLSearchParams();
    if (cursor) {
        searchParams.set('cursorDate', cursor.cursorDate);
        searchParams.set('cursorId', cursor.cursorId.toString());
    }

    const res = await get<PostsResponse>(`/api/posts/following?${searchParams}`, {
        withAuth: true,
    });

    return res.data;
}

export async function getPostsByParentId(postId: number, cursor?: Cursor) {
    const searchParams = new URLSearchParams({ parentId: postId.toString() });
    if (cursor) {
        searchParams.set('cursorDate', cursor.cursorDate);
        searchParams.set('cursorId', cursor.cursorId.toString());
    }
    const res = await get<PostsResponse>(`/api/posts?${searchParams}`, { withAuth: true });
    return res.data;
}

export async function getPostsBookmarked(q?: string, cursor?: Cursor) {
    const searchParams = new URLSearchParams();
    if (q?.trim()) searchParams.set('q', q.trim());
    if (cursor) {
        searchParams.set('cursorDate', cursor.cursorDate);
        searchParams.set('cursorId', cursor.cursorId.toString());
    }
    const res = await get<PostsResponse>(`/api/posts/bookmarks?${searchParams}`, { withAuth: true });
    return res.data;
}

export async function getPostsLiked(username: string, cursor?: Cursor) {
    const searchParams = new URLSearchParams({ username });
    if (cursor) {
        searchParams.set('cursorDate', cursor.cursorDate);
        searchParams.set('cursorId', cursor.cursorId.toString());
    }
    const res = await get<PostsResponse>(`/api/posts/likes?${searchParams}`, { withAuth: true });
    return res.data;
}

export async function getPostsByUsername(username: string, cursor?: Cursor) {
    const searchParams = new URLSearchParams({ username });
    if (cursor) {
        searchParams.set('cursorDate', cursor.cursorDate);
        searchParams.set('cursorId', cursor.cursorId.toString());
    }
    const res = await get<PostsResponse>(`/api/posts/user?${searchParams}`, { withAuth: true });
    return res.data
}

export async function getPostOne(postId: number) {
    const res = await get<{ post: Post }>(`/api/posts/${postId}`, { withAuth: true });
    return res.data.post;
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
