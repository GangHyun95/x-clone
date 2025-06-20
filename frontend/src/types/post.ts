import type { UserSummary } from '@/types/user';

export type Post = {
    id: number;
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
