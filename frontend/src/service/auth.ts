import type { ResendCodePayload, SendCodePayload, VerifyCodePayload } from '@/types/auth';

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

