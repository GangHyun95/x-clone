import toast from 'react-hot-toast';

import { useNavigate } from 'react-router-dom';

import { useLogout } from '@/hooks/auth/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { setAccessToken } from '@/store/slices/authSlice';

export default function HomeScreen() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { logout } = useLogout({
        onSuccess: () => {
        dispatch(setAccessToken({ accessToken: '' }));
        toast.success('로그아웃 되었습니다.');
        navigate('/');
        },
        onError: ({ message }) => {
            toast.error(message || '로그아웃에 실패했습니다.');
        }
    });
    return <div onClick={logout}>로그아웃!</div>
}
