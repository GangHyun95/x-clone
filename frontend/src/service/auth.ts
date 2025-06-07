import { getAccessToken } from '@/store/authStore';
import type { LoginPayload, ResendCodePayload, ResetCodePayload, ResetPasswordPayload, SendCodePayload, SignupPayload, VerifyCodePayload } from '@/types/auth';
import type { User } from '@/types/user';

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

async function get<TData>(
    url: string,
    options?: RequestInit
): Promise<ApiResponse<TData>> {
    const res = await fetch(url, {
        method: 'GET',
        ...options,
    });

    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return data;
}

export async function sendEmailCode(
    payload: SendCodePayload | ResendCodePayload | ResetCodePayload
) {
    return post<SendCodePayload | ResendCodePayload | ResetCodePayload, { expiresAt: number }>(
        '/api/auth/email-code',
        payload
    );
}

export async function verifyEmailCode(payload: VerifyCodePayload) {
    return post<VerifyCodePayload, void>('/api/auth/email-code/verify', payload);
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

export async function getMe() {
    const token = getAccessToken();
    return get<{ user: User }>('/api/users/me', {
        headers: {
            Authorization: `Bearer ${token ?? ''}`,
        },
    });
}

export async function resetPassword(payload: ResetPasswordPayload) {
    return post<ResetPasswordPayload, void>(
        '/api/auth/password-reset',
        payload
    );
}

export async function checkEmailExists(payload: { email: string }) {
    const { email } = payload;
    const data = await get<{ exists: boolean }>(
        `/api/auth/email/check?email=${encodeURIComponent(email)}`
    );

    return { exists: data.data.exists, email };
}
