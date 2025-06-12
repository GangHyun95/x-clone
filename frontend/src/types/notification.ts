import type { UserPreview } from '@/types/user';

export type Notification = {
    id: number;
    type: 'like' | 'follow';
    read: boolean;
    created_at: string;
    updated_at: string;
    user: UserPreview;
    post: {
        id: number;
        content: string;
        img: string;
    }
};
