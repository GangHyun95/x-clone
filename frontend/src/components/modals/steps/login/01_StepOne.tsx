import { useNavigate } from 'react-router-dom';
import { AppleSvg, GoogleSvg } from '@/components/svgs';
import { useForm } from 'react-hook-form';
import { useCheckEmail } from '@/hooks/auth/useCheckEmail';
import { CgSpinner } from 'react-icons/cg';

export default function ({ onNext }: { onNext: (data: { email: string }) => void; }) {
    const navigate = useNavigate();
    const form = useForm<{ email: string }>({
        mode: 'onChange',
        defaultValues: {
            email: '',
        },
    })

    const { register, handleSubmit, setError, formState: { errors, isValid } } = form;

    const { checkEmail, isCheckingEmail } = useCheckEmail({ onSuccess: onNext, setError});
    
    const onSubmit = (data: { email: string }) => {
        checkEmail(data);
    }

    return (
        <form className='flex-1 overflow-auto h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col justify-center items-stretch basis-auto shrink-0 max-w-96 h-full md:h-auto px-8 pb-12 mx-auto'>
                <h1 className='font-pyeojin text-3xl font-bold my-5 '>
                    Sign in to X
                </h1>
                <div className='my-3'>
                    <button className='btn mb-4 w-full rounded-full bg-transparent transition-colors duration-300 hover:bg-gray-200'>
                        <GoogleSvg className='mr-1 h-[18px] w-[18px]' />
                        <span>Sign in with Google</span>
                    </button>

                    <button className='btn flex w-full rounded-full bg-transparent duration-300 hover:bg-gray-200'>
                        <AppleSvg className='mr-1 h-5 w-5' />
                        <span>Sign in with Apple</span>
                    </button>

                    <div className='my-2 flex w-full items-center gap-2'>
                        <div className='h-px flex-1 bg-gray-300'></div>
                        <span className='text-base text-muted-foreground'>
                            or
                        </span>
                        <div className='h-px flex-1 bg-gray-300'></div>
                    </div>

                    <div className='py-3'>
                        <label htmlFor='email' className='floating-label'>
                            <input
                                {...register('email', {
                                    required: '이메일을 입력해 주세요.',
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: '이메일 형식이 올바르지 않습니다.',
                                    },
                                })}
                                id='email'
                                type='text'
                                placeholder='Enter your email'
                                className={`input input-xl w-full text-base peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary ${
                                    errors.email ? 'border-red-500' : ''
                                }`}
                            />
                            <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                                Email
                            </span>
                            {errors.email && (
                                <p className='text-sm text-red-500'>
                                    {errors.email.message}
                                </p>
                            )}
                        </label>
                    </div>

                    <div className='flex flex-col items-stretch flex-none my-3'>
                        <button
                            className='btn w-full rounded-full text-white bg-secondary hover:bg-secondary/90'
                            disabled={!isValid || isCheckingEmail}
                        >
                            {isCheckingEmail ? (
                                <>
                                    <CgSpinner className='animate-spin text-primary h-5 w-5' />
                                    Checking...
                                </>
                            ) : (
                                'Next'
                            )}
                        </button>
                    </div>

                    <div className='flex flex-col items-stretch flex-none my-3'>
                        <button className='btn w-full rounded-full'>
                            Forgot Password?
                        </button>
                    </div>

                    <div className='flex gap-1 mt-10'>
                        <span
                            className='text-gray-500 text-sm'
                        >
                            Don't have an account?
                        </span>
                        <button
                            className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                            onClick={() =>
                                navigate('/signup', {
                                    state: { backgroundLocation: '/' },
                                    replace: true,
                                })
                            }
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
