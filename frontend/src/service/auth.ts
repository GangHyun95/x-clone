import type { ResendCodePayload, SendCodePayload, SignupPayload, VerifyCodePayload } from '@/types/auth';

export async function sendEmailCode(payload: SendCodePayload | ResendCodePayload) {
    const res = await fetch('/api/auth/email-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return data;
}

export async function verifyEmailCode(payload: VerifyCodePayload) {
    const res = await fetch('/api/auth/email-code/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return data;
}

export async function signup(payload: SignupPayload) {
    const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return data.data;
}

export const refreshAccessToken = async () => {
    const res = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
    });

    const data = await res.json();

    if (!data.success) throw new Error(data.message || '인증 확인 중 오류가 발생했습니다.');

    return data.data;
};
