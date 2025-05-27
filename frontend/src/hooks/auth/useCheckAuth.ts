import { refreshAccessToken } from '@/service/auth';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import { useState } from 'react';

export default function useCheckAuth() {
    const dispatch = useAppDispatch();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const checkAuth = async () => {
        try {
            const data = await refreshAccessToken();
            dispatch(setAuth({ user: data.user, accessToken: data.accessToken }));
        } catch (error) {
            dispatch(setAuth({ user: null, accessToken: null }));
        } finally {
            setIsCheckingAuth(false);
        }
    };

    return { checkAuth, isCheckingAuth };
}
