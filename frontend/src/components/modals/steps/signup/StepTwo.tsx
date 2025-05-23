import { useEffect, useRef } from 'react';

export default function ({ onNext }: { onNext: () => void }) {
    const codeRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            codeRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        We sent you a code
                    </h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Enter it below to verify hgh6128@gmail.com.
                    </h3>
                </div>

                <div className='py-3'>
                    <label className='floating-label'>
                        <input
                            ref={codeRef}
                            type='text'
                            placeholder='Verification code'
                            className='input input-xl w-full peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary'
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Verification code
                        </span>

                        <div className='text-sm text-primary px-2 pt-1 hover:underline decoration-primary cursor-pointer'>
                            Didn't receive email?
                        </div>
                    </label>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                    onClick={onNext}
                >
                    Next
                </button>
            </div>
        </>
    );
}
