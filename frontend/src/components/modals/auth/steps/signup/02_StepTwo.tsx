import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

import AuthSubmitButton from '@/components/auth/button/AuthSubmitButton';
import { TextInput } from '@/components/auth/input';
import Spinner from '@/components/auth/Spinner';
import { useResendCode, useVerifyCode } from '@/hooks/auth/useAuth';
import useCountdown from '@/hooks/useCountdown';
import type { VerifyCodePayload } from '@/types/auth';
import { formatTime } from '@/utils/formatters';

type Props = {
    onNext: () => void;
    email: string;
    expiresAt: number;
    setExpiresAt: (expiresAt: number) => void;
}

export default function StepTwo({ onNext, email, expiresAt, setExpiresAt }: Props) {
    const [showMenu, setShowMenu] = useState(false);
    const form = useForm<VerifyCodePayload>({
        mode: 'onChange',
        defaultValues: {
            code: '',
        }
    })
    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;  
    const timeLeft = useCountdown(expiresAt);

    const { verifyCode, isVerifying } = useVerifyCode({ onSuccess: onNext, setError });
    
    const { resendCode, isResending } = useResendCode({
        onSuccess: ({ expiresAt, message}) => {
            setExpiresAt(expiresAt);
            setFocus('code');
            setShowMenu(false);
            toast.success(message);
        },
        onError: () => {
            setShowMenu(false);
            toast.error('인증 코드 재전송 실패');
        }
    });

    const onSubmit = (data: VerifyCodePayload) => {
        verifyCode({ ...data, email });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('code');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    if (isVerifying) return <Spinner />

    return (
        <>
            <Toaster />
            <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
                <div className='flex-1 overflow-auto px-8 md:px-20'>
                    <div className='my-5'>
                        <h1 className='text-2xl md:text-4xl font-bold'>
                            We sent you a code
                        </h1>
                        <h3 className='text-sm text-gray-500 mt-2'>
                            Enter it below to verify {email}
                        </h3>
                    </div>

                    <TextInput
                        id='code'
                        label='Verification code'
                        register={register('code', {
                            required: '인증번호를 입력해 주세요.',
                        })}
                        error={errors.code}
                    />

                    <div
                        className='text-sm text-primary px-2 pt-1 hover:underline decoration-primary cursor-pointer'
                        onClick={() => setShowMenu(prev => !prev)}
                    >
                        Didn't receive email?
                    </div>
                    <ul
                        className={`
                                list bg-base-100 border border-base-300 shadow rounded-box fixed top-0 right-0 z-50 p-0
                                transition-all duration-200
                                ${
                                    showMenu
                                        ? 'opacity-100 scale-100 visible'
                                        : 'opacity-0 scale-95 invisible pointer-events-none'
                                }
                            `}
                    >
                            <li className='p-4'>Didn't receive email?</li>

                            <li
                                className='px-4 py-3 hover:bg-base-300 cursor-pointer font-bold'
                                onClick={() => {
                                    resendCode(email);
                                }}
                            >
                                <span>Resend email</span>
                            </li>
                        </ul>

                    <div className='mt-3'>
                        <span className='text-sm text-gray-500'>
                            Time remaining: {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                <div className='flex flex-col flex-none my-6 px-8 md:px-20'>
                    <AuthSubmitButton label='Next' isLoading={isResending} loadingLabel='Resending...' disabled={!isValid || isVerifying}/>
                </div>
            </form>
        </>
    );
}
