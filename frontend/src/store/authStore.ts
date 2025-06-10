import { queryClient } from '@/lib/queryClient';
import type { UserPreview } from '@/types/user';

export function setAccessToken(token: string) {
    queryClient.setQueryData(['accessToken'], token);
}

export function getAccessToken(): string | undefined {
    return queryClient.getQueryData(['accessToken']);
}

export function getCurrentUser(): UserPreview {
    const user = queryClient.getQueryData(['me']) as UserPreview;
    return user;
}
