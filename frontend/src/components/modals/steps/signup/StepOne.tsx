import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';
import type { EmailVerifyPayload } from '@/types/auth';
import { useSendCode } from '@/hooks/auth/useSignup';

type Props = {
    onNext: (email: string, expiresAt: number) => void;
}
export default function ({ onNext }: Props) {
    const form = useForm<EmailVerifyPayload>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            fullName: '',
        },
    });
    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;
    const navigate = useNavigate();

    const { sendCode, isSending } = useSendCode({ onSuccess: onNext, setError});

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('fullName');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const onSubmit = (data: EmailVerifyPayload) => {
        sendCode(data);
    };

    if (isSending)
        return (
            <div className='flex flex-col h-full'>
                <div className='flex-1 flex items-center justify-center mb-12'>
                    <CgSpinner className='size-10 md:size-8 animate-spin text-primary' />
                </div>
            </div>
        );

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <h1 className='my-5 text-2xl md:text-4xl font-bold'>
                    Create your account
                </h1>

                <div className='py-3'>
                    <label htmlFor='fullName' className='floating-label'>
                        <input
                            {...register('fullName', {
                                required: '이름을 입력해 주세요.',
                            })}
                            id='fullName'
                            type='text'
                            placeholder='Name'
                            className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary ${
                                errors.fullName ? 'border-red-500' : ''
                            }`}
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Name
                        </span>

                        {errors.fullName && (
                            <p className='text-sm text-red-500'>
                                {errors.fullName.message}
                            </p>
                        )}
                    </label>
                </div>

                <div className='py-3'>
                    <label htmlFor='email' className='floating-label'>
                        <input
                            {...register('email', {
                                required: '이메일을 입력해 주세요.',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: '이메일 형식이 올바르지 않습니다.',
                                },
                            })}
                            id='email'
                            type='email'
                            placeholder='Email'
                            className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary ${
                                errors.email ? 'border-red-500' : ''
                            }`}
                        />
                        <span className='floating-label label-text peer-focus:text-primary'>
                            Email
                        </span>

                        {errors.email && (
                            <p className='text-sm text-red-500'>
                                {errors.email.message}
                            </p>
                        )}
                    </label>
                </div>

                <div className='flex gap-1 mt-2'>
                    <span className='text-gray-500 text-sm'>
                        Already have an account?
                    </span>
                    <button
                        type='button'
                        className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                        onClick={() =>
                            navigate('/login', {
                                state: { backgroundLocation: '/' },
                                replace: true,
                            })
                        }
                    >
                        Sign In
                    </button>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                    disabled={!isValid || isSending}
                >
                    Next
                </button>
            </div>
        </form>
    );
}
