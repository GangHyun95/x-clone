import { GoogleOAuthProvider } from '@react-oauth/google';

import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { FullPageSpinner } from '@/components/common/Spinner';
import { AppleSvg, XSvg } from '@/components/svgs';
import { useGoogleClientId } from '@/queries/auth';

export default function AuthLandingPage() {
    const { data: googleClientId = '', isLoading } = useGoogleClientId();
    if (isLoading) return <FullPageSpinner />
    return (
        <section className='flex-1 flex'>
            <div className='hidden flex-1 flex-col justify-center lg:flex'>
                <XSvg className='h-1/2 max-h-96 max-w-full' />
            </div>
            <div className='mx-auto flex min-w-[45vw] max-w-2xl flex-col p-9 lg:justify-center'>
                <XSvg className='block h-12 max-w-full self-start lg:hidden' />

                <h1 className='my-10 text-4xl font-bold sm:text-6xl lg:my-12'>Happening now</h1>
                <h2 className='mb-5 text-2xl font-extrabold sm:text-3xl lg:mb-8'>Join today.</h2>

                <section className='flex flex-col'>
                    <GoogleOAuthProvider clientId={googleClientId}>
                        <GoogleLoginButton />
                    </GoogleOAuthProvider>

                    <button className='bn btn-circle btn-ghost border-gray-300 w-[300px]'>
                        <AppleSvg className='mr-1 h-5 w-5' />
                        <span>Sign up with Apple</span>
                    </button>

                    <div className='my-2 flex w-[300px] items-center gap-4'>
                        <div className='h-px flex-1 bg-gray-100'></div>
                        <span className='text-sm text-muted-foreground'>OR</span>
                        <div className='h-px flex-1 bg-gray-100'></div>
                    </div>

                    <ModalRouteBtn
                        to='/signup'
                        className='btn btn-primary w-[300px] rounded-full px-4 text-white font-bold'
                    >
                        <span>Create account</span>
                    </ModalRouteBtn>
                </section>

                <footer className='mt-10'>
                    <h2 className='mb-4 font-bold lg:mb-5'>Already have an account?</h2>
                    <ModalRouteBtn
                        to='/login'
                        className='btn btn-ghost btn-circle border-gray-300 w-[300px] text-primary hover:bg-primary/10'
                    >
                        <span>Sign in</span>
                    </ModalRouteBtn>
                </footer>
            </div>
        </section>
    );
}
