import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import Spinner from '@/components/commons/Spinner';
import { useLogin } from '@/hooks/auth/useAuthMutations';
import { useAppDispatch } from '@/store/hooks';
import { setAccessToken } from '@/store/slices/authSlice';

export default function StepTwo({ email }: { email: string }) {
    const form = useForm<{ password: string }>({
        mode: 'onChange',
        defaultValues: {
            password: '',
        },
    });

    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [showPassword, setShowPassword] = useState(false);

    const { login, isLoggingIn } = useLogin({
        onSuccess: (data) => {
            navigate(-1);
            console.log(data);
            dispatch(setAccessToken({ accessToken: data.accessToken }));
        },
        setError,
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('password');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    const onSubmit = (data: { password: string }) => {
        login({ email, password: data.password});
    }

    if (isLoggingIn) return <Spinner />;
    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex-1 overflow-auto'>
                <div className='flex flex-col items-stretch basis-auto shrink-0 max-w-full h-full md:h-auto px-8 md:px-20 pb-12 mx-auto'>
                    <h1 className='font-pyeojin text-3xl font-bold my-5 '>
                        Enter your password
                    </h1>
                    <div className='my-3'>
                        <div className='bg-base-200 rounded px-2 py-2 w-full mb-3'>
                            <label htmlFor='email' className='block text-sm text-gray-400'>
                                Email
                            </label>
                            <input
                                id='email'
                                type='text'
                                value={email}
                                className='outline-none text-gray-400 w-full'
                                disabled
                                readOnly
                            />
                        </div>

                        <div className='py-3 relative'>
                            <label htmlFor='password' className='floating-label'>
                                <input
                                    {...register('password', {
                                        required: '비밀번호를 입력해 주세요.',
                                        minLength: {
                                            value: 6,
                                            message: '비밀번호는 최소 6자 이상이어야 합니다.',
                                        },
                                    })}
                                    id='password'
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Password'
                                    className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary ${
                                        errors.password ? 'border-red-500' : ''
                                    }`}
                                />
                                <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                                    Password
                                </span>
                                {errors.password && (
                                    <p className='text-sm text-red-500'>
                                        {errors.password.message}
                                    </p>
                                )}
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
                    disabled={!isValid || isLoggingIn}
                >
                    Login
                </button>

                <div className='flex gap-1'>
                    <span className='text-gray-500 text-sm'>
                        Don't have an account?
                    </span>
                    <button
                        type='button'
                        className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                    >
                        Sign up
                    </button>
                </div>
            </div>
        </form>
    );
}
