export interface User {
    id: number;
    nickname: string;
    full_name: string;
    email: string;
    password?: string;
    google_id?: string;
    apple_id?: string;
    profile_img?: string;
    cover_img?: string;
    bio?: string;
    link?: string;
    created_at?: Date;
    updated_at?: Date;
}

export type UserPreview = Pick<User, 'id' | 'nickname' | 'full_name' | 'profile_img'>;