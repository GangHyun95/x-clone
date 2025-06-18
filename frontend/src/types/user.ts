
export type User = {
    id: number;
    nickname: string;
    full_name: string;
    email: string;
    profile_img: string;
    cover_img: string;
    bio: string;
    link: string;
    created_at: string;
    status: {
        following: number;
        follower: number;
    };
    post_count: number;
    is_following: boolean;
};

export type UserSummary = {
    id: number;
    nickname: string;
    full_name: string;
    email: string;
    profile_img: string;
    is_following: boolean;
};

export type UpdatePasswordPayload = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};