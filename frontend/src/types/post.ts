import type { UserSummary } from '@/types/user';

export type Post = {
    id: number;
    parent_id: number;
    content: string;
    img: string;
    created_at: string;
    user: UserSummary;
    counts: {
        like: number;
        comment: number;
    };
    is_liked: boolean;
    is_bookmarked: boolean;
};
export type Cursor = { cursorDate: string; cursorId: number } | null;

export type PostsResponse = {
    posts: Post[];
    hasNextPage: boolean;
    nextCursor: Cursor;
};
