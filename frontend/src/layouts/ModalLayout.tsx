import { IoCloseOutline } from 'react-icons/io5';
import { XSvg } from '../components/svgs';

type ModalLayoutProps = {
    modalRef: React.Ref<HTMLDialogElement>;
    children: React.ReactNode;
};

export default function ModalLayout({ modalRef, children }: ModalLayoutProps) {
    return (
        <dialog ref={modalRef} className='modal'>
            <div
                className='modal-box flex flex-col w-full h-full max-w-none max-h-none p-0 rounded-none 
                        md:min-w-[600px] md:min-h-[650px] md:h-0 md:rounded-2xl md:max-w-[600px] '
            >
                {/* header */}
                <div className='flex h-14 items-stretch justify-center px-4'>
                    <form
                        method='dialog'
                        className='flex flex-1 basis-1/2 items-center'
                    >
                        <button className='btn btn-ghost btn-circle border-0'>
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
