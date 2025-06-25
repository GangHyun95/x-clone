import { useCallback, useRef } from 'react';

type Props = {
    hasNextPage: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => void;
};

export function useInfiniteScroll({ hasNextPage, isFetchingNextPage, fetchNextPage }: Props) {
    const observer = useRef<IntersectionObserver | null>(null);

    const lastPostRef = useCallback((node: HTMLElement | null) => {
        if (isFetchingNextPage) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        });

        if (node) observer.current.observe(node);
    }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

    return lastPostRef;
}