export interface User {
    id: number;
    nickname: string;
    full_name: string;
    email: string;
    profile_img: string;
    cover_img: string;
    created_at: Date;
    updated_at: Date;
    bio?: string;
    link?: string;
    google_id?: string;
    apple_id?: string;
}

export type UserPreview = Pick<User, 'id' | 'nickname' | 'full_name' | 'profile_img'>;