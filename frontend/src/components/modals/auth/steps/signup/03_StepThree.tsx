import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import AuthSubmitBtn from '@/components/auth/AuthSubmitBtn';
import Spinner from '@/components/auth/Spinner';
import { PasswordInput, TextInput } from '@/components/common/input';
import { useSignup } from '@/hooks/auth/useAuth';
import { setAccessToken } from '@/store/authStore';
import type { SignupPayload } from '@/types/auth';

type Props = {
    email: string;
    fullName: string;
};

export default function StepThree({ email, fullName }: Props) {
    const navigate = useNavigate();
    const form = useForm<SignupPayload>({
        mode: 'onChange',
        defaultValues: {
            nickname: '',
            password: '',
        },
    });
    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;


    const { signup, isSigningUp } = useSignup({
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            toast.success('회원가입이 완료되었습니다.');
            navigate(-1);
        },
        setError,
    });

    const onSubmit = (data: SignupPayload) => {
        signup({ ...data, email, fullName });
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('nickname');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    if (isSigningUp) return <Spinner />;

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <section className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        You'll need a password
                    </h1>
                    <h3 className='text-sm text-gray-500 mt-2'>
                        Make sure it’s 6 characters or more.
                    </h3>
                </div>

                <TextInput
                    id='nickname'
                    label='Nickname'
                    register={register('nickname', {
                        required: '닉네임을 입력해 주세요.',
                        minLength: {
                            value: 2,
                            message: '닉네임은 최소 2자 이상이어야 합니다.',
                        },
                    })}
                    error={errors.nickname}
                />
                <PasswordInput
                    id='password'
                    label='Password'
                    register={register('password', {
                        required: '비밀번호를 입력해 주세요.',
                        minLength: {
                            value: 6,
                            message: '비밀번호는 최소 6자 이상이어야 합니다.',
                        },
                    })}
                    error={errors.password}
                />
            </section>

            <footer className='flex flex-col flex-none my-6 px-8 md:px-20'>
                <AuthSubmitBtn
                    label='Sign up'
                    isLoading={isSigningUp}
                    loadingLabel='Signing up...'
                    disabled={!isValid}
                />
            </footer>
        </form>
    );
}
