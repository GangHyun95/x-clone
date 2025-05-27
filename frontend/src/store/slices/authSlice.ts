import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type User = {
    email: string;
    nickname: string;
    profileImg: string;
};

type AuthState = {
    user: User | null;
    accessToken: string | null;
};

const initialState: AuthState = {
    user: null,
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(
            state,
            action: PayloadAction<{ user: User; accessToken: string }>
        ) {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
    },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
