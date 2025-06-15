import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import AuthSubmitBtn from '@/components/auth/AuthSubmitBtn';
import Spinner from '@/components/auth/Spinner';
import { PasswordInput } from '@/components/common/input';
import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { useLogin } from '@/hooks/auth/useAuth';
import { setAccessToken } from '@/store/authStore';

export default function StepTwo({ email }: { email: string }) {
    const form = useForm<{ password: string }>({
        mode: 'onChange',
        defaultValues: { password: '' },
    });

    const { register, handleSubmit, setError, setFocus, formState: { errors, isValid } } = form;
    const navigate = useNavigate();

    const { login, isLoggingIn } = useLogin({
        onSuccess: (data) => {
            setAccessToken(data.accessToken);
            navigate(-1);
        },
        setError,
    });

    useEffect(() => {
        const timer = setTimeout(() => setFocus('password'), 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    const onSubmit = (data: { password: string }) => {
        login({ email, password: data.password });
    };

    if (isLoggingIn) return <Spinner />;

    return (
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex-1 overflow-auto'>
                <section className='flex flex-col max-w-full h-full md:h-auto px-8 md:px-20 pb-12 mx-auto'>
                    <h1 className='text-3xl font-bold my-5'>Enter your password</h1>
                    <div className='my-3'>
                        <fieldset className='bg-base-200 rounded px-2 py-2 w-full mb-3'>
                            <label htmlFor='email' className='block text-sm text-gray-400'>Email</label>
                            <input
                                id='email'
                                type='text'
                                value={email}
                                className='outline-none text-gray-400 w-full'
                                disabled
                                readOnly
                            />
                        </fieldset>

                        <div className='py-3 relative'>
                            <PasswordInput
                                id='password'
                                label='비밀번호를 입력해 주세요.'
                                register={register('password', {
                                    required: '비밀번호를 입력해 주세요.',
                                    minLength: {
                                        value: 6,
                                        message: '비밀번호는 최소 6자 이상이어야 합니다.',
                                    },
                                })}
                                error={errors.password}
                            />
                            <ModalRouteBtn
                                to='/reset-password'
                                replace={true}
                                className='text-sm text-primary px-2 pt-1 hover:underline decoration-primary cursor-pointer'
                            >
                                Forgot Password?
                            </ModalRouteBtn>
                        </div>
                    </div>
                </section>
            </div>
            <footer className='flex flex-col flex-none my-6 px-8 md:px-20'>
                <AuthSubmitBtn label='Login' isLoading={isLoggingIn} loadingLabel='Logging in...' disabled={!isValid} className='mb-6' />
                <nav className='flex gap-1'>
                    <span className='text-gray-500 text-sm'>Don't have an account?</span>
                    <ModalRouteBtn
                        to='/signup'
                        replace={true}
                        className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                    >
                        Sign up
                    </ModalRouteBtn>
                </nav>
            </footer>
        </form>
    );
}
