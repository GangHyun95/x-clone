import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RouteModal({ children, position='center' }: { children: React.ReactNode, position?: 'start' | 'center'}) {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        if (!modal.open) modal.showModal();
        const handleClose = () => navigate(-1);

        modal.addEventListener('close', handleClose);
        return () => modal.removeEventListener('close', handleClose);
    }, [navigate]);

    return <dialog ref={modalRef} className={`modal ${position === 'start' ? 'items-start' : ''}`}>{children}</dialog>;
}
