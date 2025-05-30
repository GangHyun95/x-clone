import { useForm } from 'react-hook-form';

import { PasswordInput } from '@/components/commons/input';
import type { ResetPasswordPayload } from '@/types/auth';

export default function StepFour() {
    const form = useForm<ResetPasswordPayload>({
        mode: 'onChange',
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const { register, watch } = form;
    return (
        <form className='flex flex-col h-full'>
            <input type='hidden' name='isResend' value='true' />
            <div className='flex-1 overflow-auto px-8 md:px-20'>
                <div className='my-5'>
                    <h1 className='text-2xl md:text-4xl font-bold'>
                        Choose a new password
                    </h1>
                    <div className='text-sm text-gray-500 mt-2'>
                        <p>
                            Make sure your new password is 6 characters or more.
                        </p>
                        <br />
                        <p>
                            You'll be logged out of all active X sessions after
                            your password is changed.
                        </p>
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
                />
                

                <PasswordInput
                    id='confirmPassword'
                    label='Confirm your password'
                    register={register('confirmPassword', {
                        required: '비밀번호 확인을 입력해 주세요.',
                        validate: (value) => value === watch('password') || '비밀번호가 일치하지 않습니다.',
                    })}
                />

                <div className='mt-3'>
                    <span className='text-sm text-gray-500'>
                        Time remaining: 03:00
                    </span>
                </div>
            </div>

            <div className='flex flex-col items-stretch flex-none my-6 px-8 md:px-20'>
                <button className='btn w-full min-h-14 rounded-full text-base text-white bg-secondary hover:bg-secondary/90'>
                    back
                </button>
            </div>
        </form>
    );
}
