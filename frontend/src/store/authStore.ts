import { queryClient } from '@/lib/queryClient';
import type { User } from '@/types/user';

export function setAccessToken(token: string) {
    queryClient.setQueryData(['accessToken'], token);
}

export function getAccessToken(): string | undefined {
    return queryClient.getQueryData(['accessToken']);
}

export function getCurrentUser(): User {
    const user = queryClient.getQueryData(['me']) as User | undefined;
    if (!user) throw new Error('No user found in cache');
    return user;
}
