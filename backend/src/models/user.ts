export type UserSummary = {
    id: number;
    nickname: string;
    full_name: string;
    email: string;
    profile_img: string;
};

export type UserDetail = UserSummary & {
    google_id?: string;
    apple_id?: string;
    cover_img: string;
    bio: string;
    link: string;
    created_at?: Date;
    updated_at?: Date;
};
