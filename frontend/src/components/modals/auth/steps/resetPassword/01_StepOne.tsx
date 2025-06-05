import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import AuthSubmitButton from '@/components/auth/button/AuthSubmitButton';
import { TextInput } from '@/components/auth/input';
import { useCheckEmail } from '@/hooks/auth/useAuth';

type Props = {
    onNext: (data: { email: string }) => void;
};

export default function StepOne({ onNext }: Props) {
    const form = useForm<{ email: string }>({
        mode: 'onChange',
        defaultValues: {
            email: '',
        }
    });

    const { register, handleSubmit, setFocus, setError, formState: { errors, isValid } } = form;

    const { checkEmail, isCheckingEmail } = useCheckEmail({ onSuccess: onNext, setError });

    const onSubmit = (data: { email: string }) => {
        checkEmail(data);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('email');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <section className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        Find your X account
                    </h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Enter the email associated with your account to change
                        your password.
                    </h3>
                </div>

                <TextInput
                    id='email'
                    type='email'
                    label='Email'
                    placeholder='Enter your email'
                    register={register('email', {
                        required: '이메일을 입력해 주세요.',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: '이메일 형식이 올바르지 않습니다.',
                        },
                    })}
                    error={errors.email}
                />
            </section>
            <footer className='flex flex-col flex-none my-6 px-8 md:px-20'>
                <AuthSubmitButton
                    label='Next'
                    isLoading={isCheckingEmail}
                    loadingLabel='Checking...'
                    disabled={!isValid}
                />
            </footer>
        </form>
    );
}
