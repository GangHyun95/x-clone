import { useEffect, useState } from 'react';

export function useBottomBarFade(maxScroll = 64, minOpacity = 0.3) {
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;

            if (y <= 0) {
                setOpacity(1);
                return;
            }

            const ratio = Math.min(1, y / maxScroll);
            const opacityValue = 1 - (1 - minOpacity) * ratio;
            setOpacity(opacityValue);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [maxScroll, minOpacity]);

    return opacity;
}