import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import AuthSubmitButton from '@/components/auth/button/AuthSubmitButton';
import { PasswordInput } from '@/components/auth/input';
import { useResetPassword } from '@/hooks/auth/useAuth';
import type { ResetPasswordPayload } from '@/types/auth';

export default function StepFour({ email }: { email: string }) {
    const navigate = useNavigate();
    const form = useForm<ResetPasswordPayload>({
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const { register, watch, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;

    const { resetPassword, isResetting } = useResetPassword({
        onSuccess: () => {
            navigate(-1);
            toast.success('비밀번호가 성공적으로 변경되었습니다.');
        },
        setError,
    });

    const onSubmit = (data: ResetPasswordPayload) => {
        resetPassword({ ...data, email });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('password');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <section className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        Choose a new password
                    </h1>
                    <div className='text-sm text-gray-500 mt-2'>
                        <p>Make sure your new password is 6 characters or more.</p>
                        <br />
                        <p>You'll be logged out of all active X sessions after your password is changed.</p>
                    </div>
                </div>

                <PasswordInput
                    id='password'
                    label='Enter a new password'
                    register={register('password', {
                        required: '비밀번호를 입력해 주세요.',
                        minLength: {
                            value: 6,
                            message: '비밀번호는 최소 6자 이상이어야 합니다.',
                        },
                    })}
                    error={errors.password}
                />

                <PasswordInput
                    id='confirmPassword'
                    label='Confirm your password'
                    register={register('confirmPassword', {
                        required: '비밀번호 확인을 입력해 주세요.',
                        validate: (value) =>
                            value === watch('password') || '비밀번호가 일치하지 않습니다.',
                    })}
                    error={errors.confirmPassword}
                />
            </section>

            <footer className='flex flex-col flex-none my-6 px-8 md:px-20'>
                <AuthSubmitButton
                    label='Change Password'
                    isLoading={isResetting}
                    loadingLabel='Changing password...'
                    disabled={!isValid}
                />
            </footer>
        </form>
    );
}
