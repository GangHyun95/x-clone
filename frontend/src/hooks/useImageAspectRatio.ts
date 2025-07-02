import { useEffect, useState } from 'react';

export function useImageAspectRatio(imgSrc?: string): number {
    const [aspectRatio, setAspectRatio] = useState(100);

    useEffect(() => {
        if (!imgSrc) return;

        const image = new Image();
        image.src = imgSrc;
        image.onload = () => {
            const ratio = (image.height / image.width) * 100;
            setAspectRatio(ratio);
        };
    }, [imgSrc]);

    return aspectRatio;
}
