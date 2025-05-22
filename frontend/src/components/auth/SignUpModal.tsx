import { forwardRef, useImperativeHandle, useRef } from 'react';
import ModalLayout from '../../layouts/ModalLayout';
import type { RefObj } from '../../pages/home/AuthLanding';

const SignUpModal = forwardRef<RefObj>((_, ref) => {
    const modalRef = useRef<HTMLDialogElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
        modalRef: modalRef.current,
        inputRef: inputRef.current,
    }));

    return (
        <ModalLayout modalRef={modalRef}>
            <div className='flex-1 overflow-auto max-w-[600px] px-8 md:px-20'>
                <h1 className='my-5 text-4xl font-bold'>Create your account</h1>

                <div className='py-3'>
                    <label className='floating-label'>
                        <input
                            ref={inputRef}
                            type='text'
                            placeholder='Name'
                            className='input input-xl w-full peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary'
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Name
                        </span>
                    </label>
                </div>

                <div className='py-3'>
                    <label className='floating-label'>
                        <input
                            type='text'
                            placeholder='Email'
                            className='input input-xl w-full peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary'
                        />
                        <span className='floating-label label-text peer-focus:text-primary'>
                            Email
                        </span>
                    </label>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button
                    disabled
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                >
                    Next
                </button>
            </div>
        </ModalLayout>
    );
});

export default SignUpModal;
