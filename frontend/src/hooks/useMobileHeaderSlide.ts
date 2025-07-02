import { useEffect, useState } from 'react';

export function useMobileHeaderSlideProgress(maxScroll = 160) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 500px)');
        if (!mq.matches) return;

        const onScroll = () => {
            const y = window.scrollY;
            const ratio = Math.min(1, y / maxScroll);
            setProgress(ratio);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [maxScroll]);

    return progress;
}
