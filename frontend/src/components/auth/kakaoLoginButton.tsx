import { KakaoSvg } from '@/components/svgs';
import { env } from '@/lib/env';

export default function KakaoLoginButton() {

    const handleKakaoLogin = () => {
        const clientId = env.KAKAO_CLIENT_ID;
        const redirectUri = env.KAKAO_REDIRECT_URI;

        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&prompt=login`;
        window.location.href = kakaoAuthUrl;
    };

    return (
        <button
            className='btn btn-circle btn-ghost border-gray-300 mb-4 w-[300px]'
            onClick={handleKakaoLogin}
        >
            <KakaoSvg className='mr-1 h-[18px] w-[18px]' />
            <span>Sign in with Kakao</span>
        </button>
    );
}
