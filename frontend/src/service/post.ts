import type { Cursor, Post, PostsResponse } from '@/types/post';

import { del, get, post, postFormData } from './api/client';

export async function getPostsAll(cursor?: Cursor) {
    const searchParams = new URLSearchParams();
    console.log(cursor);
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

export async function getPostsByParentId(postId: number) {
    const res = await get<{ posts: Post[] }>(`/api/posts?parentId=${postId}`, { withAuth: true });
    return res.data.posts;
}

export async function getPostOne(postId: number) {
    const res = await get<{ post: Post }>(`/api/posts/${postId}`, { withAuth: true });
    return res.data.post;
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
