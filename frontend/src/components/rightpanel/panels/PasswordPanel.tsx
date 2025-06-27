import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { PasswordInput } from '@/components/common/input';
import { InlineSpinner } from '@/components/common/Spinner';
import StickyHeader from '@/components/common/StickyHeader';
import { useUpdatePassword } from '@/hooks/user/useUser';
import type { UpdatePasswordPayload } from '@/types/user';

export default function PasswordPanel() {
    const navigate = useNavigate();
    const form = useForm<UpdatePasswordPayload>({
        mode: 'onChange',
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const { register, handleSubmit, watch, setError, reset, formState: { errors, isValid } } = form;
    const { update, updating } = useUpdatePassword({
        onSuccess: () => {
            reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
            toast.success('비밀번호가 변경되었습니다.');
        },
        setError,
    })
    const onSubmit = (data: UpdatePasswordPayload) => {
        update(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <StickyHeader.Header onPrev={() => navigate(-1)} showAvatarOnMobile={false}>
                <p className='text-xl font-bold'>Change your password</p>
            </StickyHeader.Header>

            <div className='border-b border-base-300'>
                <div className='border-b border-base-300 px-4'>
                    <PasswordInput
                        id='currentPassword'
                        label='Current password'
                        register={register('currentPassword', {
                            required: '현재 비밀번호를 입력해 주세요.',
                        })}
                        error={errors.currentPassword}
                    />
                </div>
                <div className='px-4'>
                    <PasswordInput
                        id='newPassword'
                        label='New password'
                        register={register('newPassword', {
                            required: '새 비밀번호를 입력해 주세요.',
                            minLength: {
                                value: 6,
                                message: '비밀번호는 최소 6자 이상이어야 합니다.',
                            },
                        })}
                        error={errors.newPassword}
                    />
                </div>
                <div className='px-4'>
                    <PasswordInput
                        id='confirmPassword'
                        label='Confirm password'
                        register={register('confirmPassword', {
                            required: '비밀번호 확인을 입력해 주세요.',
                            validate: (value) =>
                                value === watch('newPassword') || '비밀번호가 일치하지 않습니다.',
                        })}
                        error={errors.confirmPassword}
                    />
                </div>
            </div>

            <div className='flex justify-end py-3'>
                <button className='btn btn-primary btn-circle text-white w-auto h-auto min-h-9 px-4 mr-3' disabled={!isValid || updating}>
                    {updating ? <InlineSpinner /> : <span>Save</span>}
                </button>
            </div>
        </form>
    );
}
