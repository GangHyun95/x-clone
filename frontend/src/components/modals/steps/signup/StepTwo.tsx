import { useResendCode, useVerifyCode } from '@/hooks/auth/useSignup';
import { useCountdown } from '@/hooks/useCountdown';
import type { EmailVerifyPayload } from '@/types/auth';
import { formatTime } from '@/utils/time';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';

type Props = {
    onNext: () => void;
    email: string;
    expiresAt: number;
    setExpiresAt: (expiresAt: number) => void;
}

export default function ({ onNext, email, expiresAt, setExpiresAt }: Props) {
    const form = useForm<EmailVerifyPayload>({
        mode: 'onChange',
        defaultValues: {
            code: '',
        }
    })
    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;  
    const timeLeft = useCountdown(expiresAt);

    const { verifyCode, isVerifying } = useVerifyCode({ onSuccess: onNext, setError });
    
    const { resendCode, isResending } = useResendCode({
        email,
        onSuccess: (expiresAt) => {
            setExpiresAt(expiresAt);
            setFocus('code');
        },
    });

    const onSubmit = (data: EmailVerifyPayload) => {
        verifyCode({ ...data, email });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('code');
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <input type='hidden' name='isResend' value='true' />
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
                    <label htmlFor='code' className='floating-label'>
                        <input
                            {...register('code', {
                                required: '인증번호를 입력해 주세요.'
                            })}
                            id='code'
                            type='text'
                            placeholder='Verification code'
                            className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary ${
                                errors.code ? 'border-red-500' : ''
                            }`}
                        />
                        <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                            Verification code
                        </span>
                        {errors.code && (
                            <p className='text-sm text-red-500'>
                                {errors.code.message}
                            </p>
                        )}

                        <div className='text-sm text-primary px-2 pt-1 hover:underline decoration-primary cursor-pointer' onClick={() => resendCode()}>
                            Didn't receive email?
                        </div>
                    </label>
                </div>

                <div className='mt-3'>
                    <span className='text-sm text-gray-500'>
                        Time remaining: {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                    disabled={!isValid || isVerifying || isResending}
                >
                    {isVerifying || isResending ? (
                        <CgSpinner className='size-5 animate-spin' />
                    ) : (
                        'Next'
                    )}
                </button>
            </div>
        </form>
    );
}
