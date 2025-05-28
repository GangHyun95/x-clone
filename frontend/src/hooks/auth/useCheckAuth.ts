import { refreshAccessToken } from '@/service/auth';
import { useAppDispatch } from '@/store/hooks';
import { setAccessToken } from '@/store/slices/authSlice';
import { useState } from 'react';

export default function useCheckAuth() {
    const dispatch = useAppDispatch();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    const checkAuth = async () => {
        try {
            const data = await refreshAccessToken();
            dispatch(setAccessToken({ accessToken: data.accessToken }));
        } catch (error) {
            dispatch(setAccessToken({ accessToken: null }));
        } finally {
            setIsCheckingAuth(false);
        }
    };

    return { checkAuth, isCheckingAuth };
}
