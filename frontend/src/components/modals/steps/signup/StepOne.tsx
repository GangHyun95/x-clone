import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ({ onNext }: { onNext: () => void }) {
    const navigate = useNavigate();
    const nameRef = useRef<HTMLInputElement | null>(null);

    const handleSignInClick = () => {
        navigate('/login', {
            state: { backgroundLocation: '/' },
            replace: true,
        });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            nameRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <h1 className='my-5 text-2xl md:text-4xl font-bold'>
                    Create your account
                </h1>

                <div className='py-3'>
                    <label className='floating-label'>
                        <input
                            ref={nameRef}
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

                <div className='flex gap-1 mt-2'>
                    <span className='text-gray-500 text-sm'>
                        Already have an account?
                    </span>
                    <button
                        className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                        onClick={handleSignInClick}
                    >
                        Sign In
                    </button>
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
