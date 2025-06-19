import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { PasswordInput } from '@/components/common/input';
import { InlineSpinner } from '@/components/common/Spinner';
import StickyHeader from '@/components/common/StickyHeader';
import { useDeleteAccount } from '@/hooks/user/useUser';


import { setAccessToken } from '@/store/authStore';

export default function ConfirmDeletePanel() {
    const navigate = useNavigate();
    const form = useForm<{ password: string }>({
        defaultValues: {
            password: '',
        },
    });

    const { register, handleSubmit, setError, formState:{ errors }} = form;

    const { remove, deleting } = useDeleteAccount({
        onSuccess: () => {
            toast.success('회원 탈퇴가 완료되었습니다.');
            setAccessToken('');

            navigate('/');
        },
        setError,
    });

    const onSubmit = (data: { password: string }) => {
        remove(data);
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <StickyHeader.Header onPrev={() => navigate(-1)}>
                <p className='text-xl font-bold'>Confirm your password</p>
            </StickyHeader.Header>
            <div>
                <p className='px-4 py-3 text-xl font-bold'>
                    Confirm your password
                </p>
                <p className='px-4 py-3 text-sm text-gray-500'>
                    Complete your account deletion by entering your password.
                </p>
            </div>
            <div className='h-[1px] border-b border-base-300 mb-1'></div>
            <div className='px-4 py-1'>
                <PasswordInput 
                    id='password'
                    label='Password'
                    register={register('password')}
                    error={errors.password}
                />
            </div>
            <div className='h-[1px] border-b border-base-300 mb-1'></div>
            <div className='flex justify-end py-3'>
                <button
                    type='submit'
                    className='btn btn-circle w-auto bg-red-500 text-white border-0 text-base hover:bg-red-700 p-4'
                    disabled={deleting}
                >
                    {deleting ? <InlineSpinner label='Deleting' /> : <span>Delete account</span> }
                </button>
            </div>
        </form>
    );
}
