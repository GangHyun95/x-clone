import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import StickyHeader from '@/components/common/StickyHeader';
import { getCurrentUser } from '@/store/authStore';
import { useDeleteAccount } from '@/hooks/user/useUser';
import toast from 'react-hot-toast';
import { SpinnerSvg } from '@/components/svgs';

export default function DeletePanel() {
    const me = getCurrentUser();
    const navigate = useNavigate();

    const { remove, deleting } = useDeleteAccount({
        onSuccess: () => {
            toast.success('회원 탈퇴가 완료되었습니다.');
            navigate('/');
        },
        onError: () => {
            toast.error('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        remove();
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <StickyHeader.Header onPrev={() => navigate(-1)}>
                <p className='text-xl font-bold'>Delete Account</p>
            </StickyHeader.Header>
            <div>
                <div className='flex px-4 py-3'>
                    <Avatar src={me.profile_img} className='mr-2' />
                    <div className='flex flex-col'>
                        <span className='font-bold'>{me.full_name}</span>
                        <span>@{me.nickname}</span>
                    </div>
                </div>
                <p className='px-4 py-3 text-xl font-bold'>
                    You’re about to delete your account
                </p>
                <p className='px-4 py-3 text-sm text-gray-500'>
                    Once you delete your account, your profile, @username, and all your data will no longer be accessible. This action is permanent and cannot be undone.
                </p>
            </div>
            <div className='h-[1px] border-b border-base-300 mb-1'></div>
            <div className='flex justify-end'>
                <button
                    type="submit"
                    className="btn btn-ghost border-0 text-base text-red-500 h-auto rounded-none hover:bg-red-100 w-full p-4 disabled:opacity-50"
                    disabled={deleting}
                >
                    {deleting ? (
                        <>
                            <SpinnerSvg className="size-5 text-primary animate-spin" />
                            <span className="ml-1">Deleting...</span>
                        </>
                    ) : (
                        <span>Delete account</span>
                    )}
                </button>
            </div>
        </form>
    );
}
