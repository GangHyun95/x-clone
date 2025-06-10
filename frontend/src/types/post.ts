import type { UserPreview } from '@/types/user';

export type Post = {
    id: number;
    content: string;
    img: string | undefined;
    created_at: string;
    updated_at: string;
    user: UserPreview;
    counts: {
        like: number;
        comment: number;
    };
    is_liked: boolean;
    is_bookmarked: boolean;
};