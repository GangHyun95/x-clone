import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import AuthSubmitBtn from '@/components/auth/AuthSubmitBtn';
import Spinner from '@/components/auth/Spinner';
import { TextInput } from '@/components/common/input';
import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { useSendCode } from '@/hooks/auth/useAuth';
import type { SendCodePayload } from '@/types/auth';

type Props = {
    onNext: (data: { email: string; fullName: string; expiresAt: number }) => void;
};

export default function StepOne({ onNext }: Props) {
    const form = useForm<SendCodePayload>({
        mode: 'onChange',
        defaultValues: {
            email: '',
            fullName: '',
        },
    });

    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;
    const { sendCode, isSending } = useSendCode({ onSuccess: onNext, setError });

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('fullName');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    const onSubmit = (data: SendCodePayload) => {
        sendCode(data);
    };

    if (isSending) return <Spinner />;

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <section className='flex-1 overflow-auto px-8 md:px-20'>
                <h1 className='my-5 text-2xl md:text-4xl font-bold'>Create your account</h1>

                <TextInput
                    id='fullName'
                    label='Name'
                    register={register('fullName', {
                        required: '이름을 입력해 주세요.',
                    })}
                    error={errors.fullName}
                />
                <TextInput
                    id='email'
                    type='email'
                    label='Email'
                    register={register('email', {
                        required: '이메일을 입력해 주세요.',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: '이메일 형식이 올바르지 않습니다.',
                        },
                    })}
                    error={errors.email}
                />
                <div className='flex gap-1 mt-2'>
                    <span className='text-gray-500 text-sm'>Already have an account?</span>
                    <ModalRouteBtn
                        to='/login'
                        replace={true}
                        className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                    >
                        Sign In
                    </ModalRouteBtn>
                </div>
            </section>

            <footer className='flex flex-col flex-none my-6 px-8 md:px-20'>
                <AuthSubmitBtn label='Next' isLoading={isSending} loadingLabel='Sending...' disabled={!isValid} />
            </footer>
        </form>
    );
}
