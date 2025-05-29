import { useAppDispatch } from '@/store/hooks';
import { useNavigate } from 'react-router-dom';
import { logout as logoutReqest } from '@/service/auth';
import { setAccessToken } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function useLogout() {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const logout = async () => {
        setIsLoggingOut(true);
        try {
            const { message } = await logoutReqest();
            dispatch(setAccessToken({ accessToken: '' }));
            toast.success( message || '로그아웃 되었습니다.');
            navigate('/');
        } catch (error) {
            const { message } = JSON.parse((error as Error).message);
            toast.error(message);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return { logout, isLoggingOut };
}
