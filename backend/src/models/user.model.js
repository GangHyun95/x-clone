import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
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

const User = mongoose.model('User', UserSchema);

export default User;
