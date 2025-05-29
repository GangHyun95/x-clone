import type { LoginPayload, ResendCodePayload, SendCodePayload, SignupPayload, VerifyCodePayload } from '@/types/auth';

type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

async function post<TPayload, TData>(
    url: string,
    payload: TPayload,
    options?: RequestInit
): Promise<ApiResponse<TData>> {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return data;
}

export async function sendEmailCode(
    payload: SendCodePayload | ResendCodePayload
) {
    return post<SendCodePayload | ResendCodePayload, { expiresAt: number }>(
        '/api/auth/email-code/send',
        payload
    );
}

export async function verifyEmailCode(payload: VerifyCodePayload) {
    return post<VerifyCodePayload, object>('/api/auth/email-code/verify', payload);
}

export async function signup(payload: SignupPayload) {
    return post<SignupPayload, { accessToken: string }>(
        '/api/auth/signup',
        payload
    );
}

export async function login(payload: LoginPayload) {
    return post<LoginPayload, { accessToken: string }>(
        '/api/auth/login',
        payload
    );
}

export async function logout() {
    return post<void, { message: string }>('/api/auth/logout', undefined, {
        credentials: 'include',
    });
}

export async function refreshAccessToken() {
    return post<void, { accessToken: string }>('/api/auth/refresh', undefined, {
        credentials: 'include',
    });
}

export async function checkEmailExists(payload: { email: string }) {
    const { email } = payload;
    const res = await fetch(
        `/api/auth/email/check?email=${encodeURIComponent(email)}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }
    );

    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return { exists: data.data.exists, email };
}
