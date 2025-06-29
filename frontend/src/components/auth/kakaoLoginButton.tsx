import { KakaoSvg } from '@/components/svgs';

export default function KakaoLoginButton() {

    const handleKakaoLogin = () => {
        const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

        const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakaoClientId}&redirect_uri=${redirectUri}&prompt=login`;
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
