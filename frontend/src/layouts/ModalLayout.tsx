import { IoCloseOutline } from 'react-icons/io5';
import { XSvg } from '@/components/svgs';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
        if (modal && !modal.open) {
            modal.showModal();
        }
    }, []);

    const handleClose = () => {
        modalRef.current?.close();
        navigate(-1);
    };

    return (
        <dialog ref={modalRef} className='modal'>
            <div
                className={`modal-box flex flex-col w-full h-full max-w-none p-0 rounded-none 
                        md:min-w-[600px] md:h-[650px] md:min-h-[400px] md:max-h-[90vh] md:rounded-2xl md:max-w-[600px] ${className}`}
            >
                {/* header */}
                <div className='flex h-14 items-stretch justify-center px-4'>
                    <form
                        method='dialog'
                        className='flex flex-1 basis-1/2 items-center'
                    >
                        <button
                            className='btn btn-ghost btn-circle border-0'
                            onClick={handleClose}
                        >
                            <IoCloseOutline className='text-2xl' />
                        </button>
                    </form>
                    <div className='flex flex-1 basis-auto min-w-8 items-center'>
                        <XSvg />
                    </div>
                    <div className='flex-1 basis-1/2 min-h-8' />
                </div>

                {/* content */}
                {children}
            </div>
        </dialog>
    );
}
