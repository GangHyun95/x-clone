import { useEffect, useRef } from 'react';

export default function () {
    const nicknameRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            nicknameRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <h1 className='my-5 text-2xl md:text-4xl font-bold'>
                    You'll need a password
                </h1>

                <div className='py-3'>
                    <label className='floating-label'>
                        <input
                            id='nickname'
                            ref={nicknameRef}
                            type='text'
                            placeholder='Nickname'
                            className='input input-xl w-full peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary'
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Nickname
                        </span>
                    </label>
                </div>
                <div className='py-3'>
                    <label className='floating-label'>
                        <input
                            type='password'
                            placeholder='Password'
                            className='input input-xl w-full peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary'
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Password
                        </span>
                    </label>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                >
                    Sign up
                </button>
            </div>
        </>
    );
}
