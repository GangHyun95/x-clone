import { GoogleOAuthProvider } from '@react-oauth/google';

import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import KakaoLoginButton from '@/components/auth/kakaoLoginButton';
import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { env } from '@/lib/env';
import { LogoSvg } from '@/components/svgs';

export default function AuthLandingPage() {
    const clientId = env.GOOGLE_CLIENT_ID;
    return (
        <section className='flex-1 flex'>
            <div className='hidden flex-1 flex-col justify-center lg:flex'>
                <LogoSvg className='h-1/2 max-h-96 max-w-full' />
            </div>
            <div className='mx-auto flex min-w-[45vw] max-w-2xl flex-col p-9 lg:justify-center'>
                <LogoSvg className='block h-12 max-w-full self-start lg:hidden' />

                <h1 className='my-10 text-4xl font-bold sm:text-6xl lg:my-12'>Share your day</h1>
                <div className="mb-5 text-xl text-base-content/60 font-bold sm:text-2xl lg:mb-8">
                    <h2>
                        This is a personal portfolio project.<br/>
                    </h2>
                    <h3>It is not an actual service or a commercial product.</h3>
                </div>


                <section className='flex flex-col'>
                    <GoogleOAuthProvider clientId={clientId}>
                        <GoogleLoginButton />
                    </GoogleOAuthProvider>

                    <KakaoLoginButton />

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
