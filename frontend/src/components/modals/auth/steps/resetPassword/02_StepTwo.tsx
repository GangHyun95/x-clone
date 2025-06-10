import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import AuthSubmitBtn from '@/components/auth/AuthSubmitBtn';
import { usePasswordResetCode } from '@/hooks/auth/useAuth';
import { maskEmail } from '@/utils/formatters';

type Props = {
    email: string;
    onNext: (data: { expiresAt: number }) => void;
};

export default function StepTwo({ onNext, email }: Props) {
    const navigate = useNavigate();

    const { sendPasswordResetCode, isSending } = usePasswordResetCode({
        onSuccess: ({ expiresAt }) => {
            onNext({ expiresAt });
        },
        onError: () => {
            toast.error('인증 코드 재전송 실패');
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendPasswordResetCode(email);  
    };

    return (
        <>
            <Toaster />
            <form className='flex flex-col h-full' onSubmit={handleSubmit}>
                <section className='flex-1 overflow-auto px-8 md:px-20'>
                    <div className='my-5'>
                        <h1 className='text-2xl md:text-4xl font-bold'>
                            Where should we send a confirmation code?
                        </h1>
                        <div className='text-sm text-gray-500 mt-2'>
                            <p>
                                Before you can change your password, we need to
                                make sure it’s really you.
                            </p>
                            <br />
                            <p>
                                Start by choosing where to send a confirmation
                                code.
                            </p>
                        </div>
                    </div>
                    <div className='p-2'>
                        <label className='group flex items-center justify-between rounded-lg bg-white cursor-pointer'>
                            <span className='text-sm font-semibold text-gray-900'>
                                Send an email to{' '}
                                <span className='font-normal'>
                                    {maskEmail(email)}
                                </span>
                            </span>
                            <div className='flex justify-center items-center p-1.5 rounded-full group-hover:bg-primary/10 transition-colors'>
                                <input
                                    type='radio'
                                    className='radio radio-primary radio-sm'
                                    checked
                                />
                            </div>
                        </label>
                    </div>
                </section>
                <footer className='flex flex-col flex-none my-6 px-8 md:px-20'>
                    <AuthSubmitBtn
                        label='Next'
                        isLoading={isSending}
                        loadingLabel='Resending...'
                        disabled={false}
                        className='mb-4'
                    />
                    <button
                        type='button'
                        className='btn btn-ghost btn-circle border-gray-300 w-full min-h-14 text-base'
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </footer>
            </form>
        </>
    );
}
