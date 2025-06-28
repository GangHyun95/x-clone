import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

import { InlineSpinner } from '@/components/common/Spinner';
import { GoogleSvg } from '@/components/svgs';

import { useGoogleLoginAction } from '@/hooks/auth/useAuth';
import { setAccessToken } from '@/store/authStore';

export default function GoogleLoginButton() {
    const { loginWithGoogleCode, isLoggingIn } = useGoogleLoginAction({
        onSuccess: ({ accessToken }) => setAccessToken(accessToken),
        onError: (message) => toast.error(message || 'Google 로그인 실패'),
    });
    const googleLoginHandler = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: ({ code }) => {
            loginWithGoogleCode(code);
        },
        onError: () => {
            toast.error('Google 로그인 실패');
        },
    });
    return (
            <button className='bn btn-circle btn-ghost border-gray-300 mb-4 w-[300px]' disabled={isLoggingIn} onClick={googleLoginHandler}>
            {isLoggingIn
                ? <InlineSpinner label='Signing in with Google' />
                : (
                    <>
                        <GoogleSvg className='mr-1 h-[18px] w-[18px]' />
                        <span>Sign up with Google</span>
                    </>
                )
            }
                
            </button>
    );
}
