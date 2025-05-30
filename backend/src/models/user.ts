export interface IUser {
    id: number;
    nickname: string;
    fullName: string;
    email: string;
    password?: string;
    googleId?: string;
    appleId?: string;
    profileImg?: string;
    coverImg?: string;
    bio?: string;
    link?: string;
    createdAt?: Date;
    updatedAt?: Date;
}