import Spinner from '@/components/commons/Spinner';
import { useSignup } from '@/hooks/auth/useAuthMutations';
import { useAppDispatch } from '@/store/hooks';
import { setAccessToken } from '@/store/slices/authSlice';
import type { SignupPayload } from '@/types/auth';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

type Props = {
    email: string;
    fullName: string;
}
export default function ({ email, fullName }: Props) {
    const navigate = useNavigate();
    const form = useForm<SignupPayload>({
        mode: 'onChange',
        defaultValues: {
            nickname: '',
            password: '',
        },
    });
    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;  
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();

    const { signup, isSigningUp } = useSignup({
        onSuccess: (data) => {
            toast.success('회원가입이 완료되었습니다.');
            dispatch(setAccessToken({ accessToken: data.accessToken}))
            navigate(-1);
        },
        setError,
    })

    const onSubmit = (data: SignupPayload) => {
        signup({...data, email, fullName });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('nickname');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (isSigningUp) return <Spinner />

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        You'll need a password
                    </h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Make sure it’s 6 characters or more.
                    </h3>
                </div>

                <div className='py-3'>
                    <label htmlFor='nickname' className='floating-label'>
                        <input
                            {...register('nickname', {
                                required: '닉네임을 입력해 주세요.',
                                minLength: {
                                    value: 2,
                                    message: '닉네임은 최소 2자 이상이어야 합니다.',
                                },
                            })}
                            id='nickname'
                            type='text'
                            placeholder='Nickname'
                            className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary ${
                                errors.nickname ? 'border-red-500' : ''
                            }`}
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Nickname
                        </span>
                        {errors.nickname && (
                            <p className='text-sm text-red-500'>
                                {errors.nickname.message}
                            </p>
                        )}
                    </label>
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
                            
                            className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary pr-10 ${
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
                        {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90' disabled={!isValid || isSigningUp}>
                    Sign up
                </button>
            </div>
        </form>
    );
}
