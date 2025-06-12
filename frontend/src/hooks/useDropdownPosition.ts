import { useEffect, useRef, useState } from 'react';

type Props = {
    open: boolean;
    anchor?: 'top' | 'bottom';
    alignment?: 'left' | 'right';
}

type Position = Partial<{
    top: number;
    bottom: number;
    left: number;
    right: number;
}>

export default function useDropdownPosition({ open, anchor = 'bottom', alignment = 'left' }: Props) {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState<Position>({});

    const calculatePosition = () => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();

        const vertical = anchor === 'bottom'
            ? { bottom: window.innerHeight - rect.bottom - (rect.height / 2) - window.scrollY }
            : { bottom: window.innerHeight - rect.top };

        const horizontal = alignment === 'left'
            ? { left: rect.left + window.scrollX }
            : { right: window.innerWidth - rect.right - window.scrollX };

        setPosition({ ...vertical, ...horizontal });
    };

    useEffect(() => {
        if (open) calculatePosition();
    }, [open])

    useEffect(() => {
        if (!open) return;

        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(calculatePosition, 150);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [open]);
    
    return { btnRef, position}
}

