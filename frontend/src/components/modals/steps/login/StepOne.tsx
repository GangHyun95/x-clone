import { useNavigate } from 'react-router-dom';
import { AppleSvg, GoogleSvg } from '@/components/svgs';

export default function ({ onNext }: { onNext: () => void }) {
    const navigate = useNavigate();

    const handleSignUpClick = () => {
        navigate('/signup', {
            state: { backgroundLocation: '/' },
            replace: true,
        });
    };
    return (
        <div className='flex-1 overflow-auto h-full'>
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
                        <label className='floating-label'>
                            <input
                                type='text'
                                placeholder='Enter your email'
                                className='input input-xl w-full peer placeholder:text-base focus:outline-0 focus:border-primary focus:ring-primary'
                            />
                            <span className='floating-label label-text peer-focus:text-primary peer-focus:text-sm'>
                                Email
                            </span>
                        </label>
                    </div>

                    <div className='flex flex-col items-stretch flex-none my-3'>
                        <button
                            className='btn w-full rounded-full text-white bg-secondary hover:bg-secondary/90'
                            onClick={onNext}
                        >
                            Next
                        </button>
                    </div>

                    <div className='flex flex-col items-stretch flex-none my-3'>
                        <button className='btn w-full rounded-full'>
                            Forgot Password?
                        </button>
                    </div>

                    <div className='flex gap-1 mt-10'>
                        <span className='text-gray-500 text-sm'>
                            Don't have an account?
                        </span>
                        <button
                            className='text-sm text-primary cursor-pointer hover:underline decoration-primary underline-offset-4'
                            onClick={handleSignUpClick}
                        >
                            Sign up
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
