import { getAccessToken } from '@/store/authStore';

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

type RequestOptions = RequestInit & { withAuth?: boolean };

function buildHeaders(withAuth?: boolean, headers?: HeadersInit): Headers {
    const builtHeaders = new Headers(headers);
    if (withAuth) {
        const token = getAccessToken();
        builtHeaders.set('Authorization', `Bearer ${token}`);
    }
    return builtHeaders;
}

async function request<TData>(
    url: string,
    init: RequestInit,
    withAuth?: boolean
): Promise<ApiResponse<TData>> {
    const headers = buildHeaders(withAuth, init.headers);
    const res = await fetch(url, { ...init, headers });
    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));
    return data;
}

export async function post<TPayload, TData>(
    url: string,
    payload: TPayload,
    options?: RequestOptions
): Promise<ApiResponse<TData>> {
    return request<TData>(
        url,
        {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {}),
            },
        },
        options?.withAuth
    );
}

export async function postFormData<TData>(
    url: string,
    formData: FormData,
    options?: RequestOptions
): Promise<ApiResponse<TData>> {
    return request<TData>(
        url,
        {
            method: 'POST',
            body: formData,
            ...options,
        },
        options?.withAuth
    );
}

export async function get<TData>(
    url: string,
    options?: RequestOptions
): Promise<ApiResponse<TData>> {
    return request<TData>(
        url,
        { method: 'GET', ...options },
        options?.withAuth
    );
}

export async function del<TData>(
    url: string,
    options?: RequestOptions
): Promise<ApiResponse<TData>> {
    return request<TData>(
        url,
        { method: 'DELETE', ...options },
        options?.withAuth
    );
}
