import { useState, useEffect } from 'react';

export default function useCountdown(expiresAt: number | string) {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Date.now();
            const expiresTime = new Date(expiresAt).getTime();
            const diff = expiresTime - now;
            return diff > 0 ? diff : 0;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft <= 0) {
                clearInterval(timer);
                setTimeLeft(0);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    return timeLeft;
}
