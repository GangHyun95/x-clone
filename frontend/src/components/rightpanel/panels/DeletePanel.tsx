import { Link, useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import StickyHeader from '@/components/common/StickyHeader';
import { getCurrentUser } from '@/store/authStore';

export default function DeletePanel() {
    const me = getCurrentUser();
    const navigate = useNavigate();
    
    return (
        <>
            <StickyHeader.Header onPrev={() => navigate(-1)} showAvatarOnMobile={false}>
                <p className='text-xl font-bold'>Delete Account</p>
            </StickyHeader.Header>
            <div>
                <div className='flex px-4 py-3'>
                    <Avatar src={me.profile_img} className='mr-2' />
                    <div className='flex flex-col'>
                        <span className='font-bold'>{me.full_name}</span>
                        <span>@{me.username}</span>
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
                <Link
                    to='/settings/delete/confirm'
                    className='btn btn-ghost border-0 text-base text-red-500 h-auto rounded-none hover:bg-red-100 w-full p-4'
                >
                    <span>Delete account</span>
                </Link>
            </div>
        </>
    );
}
