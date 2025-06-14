import type { UserSummary } from '@/types/user';

export type Notification = {
    id: number;
    type: 'like' | 'follow';
    read: boolean;
    created_at: string;
    user: UserSummary;
    post?: {
        id: number;
        content: string;
        img: string | null;
    };
};
