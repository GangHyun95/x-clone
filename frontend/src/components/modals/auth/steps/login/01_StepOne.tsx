import { GoogleOAuthProvider } from '@react-oauth/google';
import { useForm } from 'react-hook-form';

import AuthSubmitBtn from '@/components/auth/AuthSubmitBtn';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import KakaoLoginButton from '@/components/auth/kakaoLoginButton';
import { TextInput } from '@/components/common/input';
import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { useCheckEmail } from '@/hooks/auth/useAuth';
import { env } from '@/lib/env';

export default function StepOne({ onNext }: { onNext: (data: { email: string }) => void; }) {
    const form = useForm<{ email: string }>({
        mode: 'onChange',
        defaultValues: { email: '' },
    })

    const { register, handleSubmit, setError, formState: { errors, isValid } } = form;

    const { checkEmail, isCheckingEmail } = useCheckEmail({ onSuccess: onNext, setError});
    
    const onSubmit = (data: { email: string }) => {
        checkEmail(data);
    }

    return (
        <form className='flex-1 overflow-auto h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col justify-center max-w-96 h-full md:h-auto px-8 pb-12 mx-auto'>
                <h1 className='font-pyeojin text-3xl font-bold my-5 '>
                    Sign in to X
                </h1>
                <section className='my-3'>
                    <GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
                        <GoogleLoginButton className='w-full'/>
                    </GoogleOAuthProvider>
                    <KakaoLoginButton className='w-full'/>

                    <div className='my-2 flex w-full items-center gap-2'>
                        <div className='h-px flex-1 bg-gray-300'></div>
                        <span className='text-base text-muted-foreground'>or</span>
                        <div className='h-px flex-1 bg-gray-300'></div>
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

                    <div className='flex flex-col flex-none my-3'>
                        <AuthSubmitBtn label='Next' isLoading={isCheckingEmail} loadingLabel='Checking...' disabled={!isValid} className='text-sm min-h-auto'/>
                    </div>

                    <div className='flex flex-col flex-none my-3'>
                        <ModalRouteBtn to='/reset-password' replace={true} className='btn btn-circle w-full'>
                            Forgot Password?
                        </ModalRouteBtn>
                    </div>

                    <nav className='flex gap-1 mt-10'>
                        <span className='text-gray-500 text-sm'>Don't have an account?</span>
                        <ModalRouteBtn
                            to='/reset-password'
                            replace={true}
                            className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                        >
                            Sign up
                        </ModalRouteBtn>
                    </nav>
                </section>
            </div>
        </form>
    );
}
