export interface IUser {
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