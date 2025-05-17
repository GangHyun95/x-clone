import mongoose from 'mongoose';

export interface IUser {
    _id: mongoose.Types.ObjectId;
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
    followers: mongoose.Types.ObjectId[];
    following: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
    {
        nickname: {
            type: String,
            required: true,
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId && !this.appleId;
            },
        },
        googleId: {
            type: String,
            sparse: true,
        },
        appleId: {
            type: String,
            sparse: true,
        },

        profileImg: {
            type: String,
            default: '',
        },
        coverImg: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            default: '',
        },
        link: {
            type: String,
            default: '',
        },

        followers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: [],
            },
        ],
        following: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                default: [],
            },
        ],
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
