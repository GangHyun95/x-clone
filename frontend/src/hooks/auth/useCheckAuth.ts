import { useState } from 'react';

import { refreshAccessToken } from '@/service/auth';
import { useAppDispatch } from '@/store/hooks';
import { setAccessToken } from '@/store/slices/authSlice';

export default function useCheckAuth() {
    const dispatch = useAppDispatch();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await refreshAccessToken();
            dispatch(setAccessToken({ accessToken: res.data.accessToken }));
        } catch {
            dispatch(setAccessToken({ accessToken: null }));
        } finally {
            setIsCheckingAuth(false);
        }
    };

    return { checkAuth, isCheckingAuth };
}
