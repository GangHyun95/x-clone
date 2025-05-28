import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    accessToken: string | null;
};

const initialState: AuthState = {
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<AuthState>) => {
            state.accessToken = action.payload.accessToken;
        },
    },
});

export const { setAccessToken } = authSlice.actions;
export default authSlice.reducer;
