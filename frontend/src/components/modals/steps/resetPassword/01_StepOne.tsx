import { TextInput } from '@/components/commons/input';
import { useCheckEmail } from '@/hooks/auth/useCheckEmail';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CgSpinner } from 'react-icons/cg';

type Props = {
    onNext: (data: { email: string }) => void;
}
export default function StepOne({ onNext }: Props) {
    const form = useForm<{ email: string }>({
        mode: 'onChange',
        defaultValues: {
            email: '',
        }
    });

    const { register, handleSubmit, setFocus, setError, formState: { errors, isValid } } = form;

    const { checkEmail, isCheckingEmail } = useCheckEmail({ onSuccess: onNext, setError})

    const onSubmit = (data: { email: string }) => {
        checkEmail(data);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setFocus('email');
        }, 100);
        return () => clearTimeout(timer);
    }, [setFocus]);

    return (
        <>
        <form className='flex flex-col h-full' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex-1 overflow-auto px-8 md:px-20'>
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
            </div>
            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button
                    className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'
                    disabled={!isValid}
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
        </form>
        </>
    );
}
