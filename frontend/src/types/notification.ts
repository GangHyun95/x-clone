import type { UserSummary } from '@/types/user';

export type Notification = {
    id: number;
    type: 'like' | 'follow' | 'comment_like';
    read: boolean;
    created_at: string;
    user: UserSummary;
    post?: {
        id: number;
        content: string;
        img: string;
    };
};
