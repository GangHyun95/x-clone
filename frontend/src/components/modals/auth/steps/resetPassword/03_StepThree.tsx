import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import AuthSubmitButton from '@/components/auth/button/AuthSubmitButton';
import { TextInput } from '@/components/auth/input';
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
    const { verifyCode, isVerifying } = useVerifyCode({ onSuccess: onNext, setError });

    const onSubmit = (data: VerifyCodePayload) => {
        verifyCode({ ...data, email });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('code');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <section className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>We sent you a code</h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Check your email to get your confirmation code. If you need to request a new code, go back and reselect a confirmation.
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
                    <span className='text-sm text-gray-500'>Time remaining: {formatTime(timeLeft)}</span>
                </div>
            </section>

            <footer className='flex flex-col flex-none my-6 px-8 md:px-20'>
                {isValid ? (
                    <AuthSubmitButton label='Next' isLoading={isVerifying} loadingLabel='Verifying...' disabled={!isValid} />
                ) : (
                    <button
                        type='button'
                        className='btn btn-ghost btn-circle border-gray-300 w-full min-h-14 text-base'
                        onClick={onPrev}
                    >
                        Back
                    </button>
                )}
            </footer>
        </form>
    );
}
