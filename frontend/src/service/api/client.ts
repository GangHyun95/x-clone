export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export async function post<TPayload, TData>(
    url: string,
    payload: TPayload,
    options?: RequestInit
): Promise<ApiResponse<TData>> {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(options?.headers || {}),
        },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return data;
}

export async function postFormData<TData>(
    url: string,
    formData: FormData,
    options?: RequestInit
): Promise<ApiResponse<TData>> {
    const res = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            ...(options?.headers || {}),
        },
    });

    const data = await res.json();
    if (!data.success) throw new Error(JSON.stringify(data));

    return data;
}

export async function get<TData>(
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
