import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const location = useLocation();
    const isModal = Boolean(location.state?.backgroundLocation);

    useEffect(() => {
        if (isModal) return;
        window.scrollTo({ top: 0 });
    }, [location.pathname, location.search, isModal]);

    return null;
}
