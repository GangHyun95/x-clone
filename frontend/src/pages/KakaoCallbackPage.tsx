import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { FullPageSpinner } from '@/components/common/Spinner';
import { kakaoLogin } from '@/service/auth';
import { setAccessToken } from '@/store/authStore';

export default function KakaoCallbackPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const calledRef = useRef(false);

    useEffect(() => {
        const code = params.get('code');
        if (!code || calledRef.current) return;

        calledRef.current = true;
        kakaoLogin({ code })
            .then(res => {
                setAccessToken(res.data.accessToken);
                navigate('/');
                window.history.replaceState(null, '', '/');
            })
            .catch(() => {
                alert('카카오 로그인 실패');
                navigate('/');
            });
    }, []);

    return <FullPageSpinner />
}
