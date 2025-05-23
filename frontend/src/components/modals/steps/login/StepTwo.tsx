import { useEffect, useRef, useState } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

export default function () {
    const [showPassword, setShowPassword] = useState(false);

    const passwordRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const timer = setTimeout(() => {
            passwordRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);
    return (
        <>
            <div className='flex-1 overflow-auto'>
                <div className='flex flex-col justify-center items-stretch basis-auto shrink-0 max-w-full h-full md:h-auto px-20 pb-12 mx-auto'>
                    <h1 className='font-pyeojin text-3xl font-bold my-5 '>
                        Enter your password
                    </h1>
                    <div className='my-3'>
                        <div className='bg-base-200 rounded px-2 py-2 w-full mb-3'>
                            <label className='block text-sm text-gray-400'>
                                Email
                            </label>
                            <input
                                type='text'
                                value='hgh6128@gmail.com'
                                className='outline-none text-gray-400 w-full'
                                disabled
                                readOnly
                            />
                        </div>

                        <div className='py-3 relative'>
                            <label className='floating-label'>
                                <input
                                    ref={passwordRef}
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Password'
                                    className='input input-xl w-full peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary pr-10'
                                />
                                <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                                    Password
                                </span>
                            </label>
                            <div
                                className='absolute right-3 top-1/2 -translate-y-1/2 z-10 text-xl cursor-pointer'
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <IoEyeOffOutline />
                                ) : (
                                    <IoEyeOutline />
                                )}
                            </div>
                            <div className='text-sm text-primary px-2 pt-1 hover:underline decoration-primary cursor-pointer'>
                                Forgot password?
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90 mb-6'
                    disabled
                >
                    Login
                </button>

                <div className='flex gap-1'>
                    <span className='text-gray-500 text-sm'>
                        Don't have an account?
                    </span>
                    <button className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'>
                        Sign up
                    </button>
                </div>
            </div>
        </>
    );
}
