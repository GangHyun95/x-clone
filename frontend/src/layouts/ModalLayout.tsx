import { useEffect, useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { XSvg } from '@/components/svgs';

export default function ModalLayout({
    children,
    className = '',
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const modal = modalRef.current;
        if (!modal) return;

        if (!modal.open) {
            modal.showModal();
        }

        const handleClose = () => {
            navigate(-1);
        };

        modal.addEventListener('close', handleClose);
        return () => {
            modal.removeEventListener('close', handleClose);
        };
    }, [navigate]);

    return (
        <dialog ref={modalRef} className='modal'>
            <div
                className={`modal-box flex flex-col w-full h-full max-w-none p-0 rounded-none 
                        md:min-w-[600px] md:h-[650px] md:min-h-[400px] md:max-h-[90vh] md:rounded-2xl md:max-w-[600px] ${className}`}
            >
                {/* header */}
                <div className='flex h-14 justify-center px-4'>
                    <form
                        method='dialog'
                        className='flex flex-1 basis-1/2 items-center'
                    >
                        <button
                            className='btn btn-ghost btn-circle border-0'
                        >
                            <IoCloseOutline className='text-2xl' />
                        </button>
                    </form>
                    <div className='flex flex-auto min-w-8 items-center'>
                        <XSvg />
                    </div>
                    <div className='flex-1 basis-1/2 min-h-8' />
                </div>

                {/* content */}
                <div className='flex-1 flex flex-col overflow-hidden'>
                    {children}
                </div>
            </div>
        </dialog>
    );
}
