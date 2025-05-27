import { refreshAccessToken } from '@/service/auth';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import { useMutation } from '@tanstack/react-query';

export default function useCheckAuth() {
    const dispatch = useAppDispatch();
    const { mutate, isPending } = useMutation({
        mutationFn: refreshAccessToken,
        onSuccess: (data) => {
            dispatch(setAuth({ user: data.user, accessToken: data.accessToken}));
        },
        onError: () => {
            
        },
    });

    return { checkAuth: mutate, isCheckingAuth: isPending}
}