import { queryClient } from '@/lib/queryClient';

export function setAccessToken(token: string) {
    queryClient.setQueryData(['accessToken'], token);
}

export function getAccessToken(): string | undefined {
    return queryClient.getQueryData(['accessToken']);
}
