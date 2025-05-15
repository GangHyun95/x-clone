import jwt from 'jsonwebtoken';

export const generateToken = (id, type) => {
    const secret =
        type === 'access'
            ? process.env.ACCESS_TOKEN_SECRET
            : process.env.REFRESH_TOKEN_SECRET;
    const expiresIn = type === 'access' ? '15m' : '1d';

    return jwt.sign({ id }, secret, {
        expiresIn,
    });
};

export const buildUserResponse =  (user) => {
    return {
        _id: user._id,
        fullName: user.fullName,
        nickname: user.nickname,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        bio: user.bio,
        link: user.link,
    };
}