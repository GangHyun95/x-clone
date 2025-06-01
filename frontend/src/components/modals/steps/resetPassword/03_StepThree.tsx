import { useEffect } from 'react';

import { useForm } from 'react-hook-form';

import { TextInput } from '@/components/commons/input';
import { useVerifyCode } from '@/hooks/auth/useAuth';
import useCountdown from '@/hooks/useCountdown';
import type { VerifyCodePayload } from '@/types/auth';
import { formatTime } from '@/utils/formatters';

type Props = {
    email: string;
    expiresAt: number;
    onPrev: () => void;
    onNext: () => void;
};
export default function StepThree({ email, expiresAt, onPrev, onNext }: Props) {
    const timeLeft = useCountdown(expiresAt);
    const form = useForm<VerifyCodePayload>({
        mode: 'onChange',
        defaultValues: {
            code: '',
        },
    });
    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;
    const { verifyCode, isVerifying } = useVerifyCode({
        onSuccess: onNext,
        setError,
    })

    const onSubmit = (data: VerifyCodePayload) => {
        verifyCode({ ...data, email });
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('code');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus])

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        We sent you a code
                    </h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Check your email to get your confirmation code. If you
                        need to request a new code, go back and reselect a
                        confirmation.
                    </h3>
                </div>

                <TextInput
                    id='code'
                    label='Enter your code'
                    register={register('code', {
                        required: '코드를 입력해 주세요.',
                    })}
                    error={errors.code}
                />

                <div className='mt-3'>
                    <span className='text-sm text-gray-500'>
                        Time remaining: {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                {isValid ? (
                    <button
                        className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                        disabled={!isValid || isVerifying}
                    >
                        Next
                    </button>
                ) : (
                    <button
                        type='button'
                        className='btn w-full min-h-14 rounded-full text-base bg-transparent duration-300 hover:bg-gray-200'
                        onClick={onPrev}
                    >
                        Back
                    </button>
                )}
            </div>
        </form>
    );
}
