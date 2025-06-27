import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import { FullPageSpinner } from '@/components/common/Spinner';
import { LogoutSvg } from '@/components/svgs';
import { useLogout } from '@/hooks/auth/useAuth';
import { queryClient } from '@/lib/queryClient';
import GlobalPortal from '@/portals/GlobalPortal';
import { setAccessToken } from '@/store/authStore';
import type { User } from '@/types/user';

type Props = {
    open: boolean;
    onClose: () => void;
    user: User;
};

export default function MobileSidebar({ open, onClose, user }: Props) {
    const navigate = useNavigate();
    const { logout, isLoggingOut } = useLogout({
        onSuccess: () => {
            queryClient.clear();
            navigate('/');
            setAccessToken('');
            toast.success('로그아웃 되었습니다.');
        },
        onError({ message }) {
            console.error(message);
        },
    });

    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        if (open) {
            requestAnimationFrame(() => {
                setAnimate(true);
            });
        } else {
            setAnimate(false);
        }
    }, [open]);

    if (isLoggingOut) {
        return (
            <GlobalPortal>
                <FullPageSpinner />
            </GlobalPortal>
        )
    }
    if (!open) return null;

    return (
        <GlobalPortal>
            <div className='absolute inset-0 z-10'>
                <div
                    className='fixed inset-0 bg-black/40 z-0'
                    onClick={onClose}
                />
                <div
                    className={`fixed top-0 left-0 z-20 h-screen w-[70%] max-w-[280px] bg-white shadow-lg flex flex-col pb-11 transform transition-transform duration-300
                    ${animate ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className='flex flex-col p-4'>
                        <Avatar src={user.profile_img} username={user.username} />
                        <div className='flex flex-col mt-2'>
                            <span className='font-bold'>{user.full_name}</span>
                            <span className='text-sm text-gray-500'>@{user.username}</span>
                        </div>
                        <div className='flex text-sm mt-3'>
                            <Link to={`/users/${user.username}?tab=following`} className='mr-5 hover:underline' onClick={onClose}>
                                <span className='font-bold text-black'>{user.status.following}</span>{' '}
                                <span className='text-gray-500'>Following</span>
                            </Link>
                            <Link to={`/users/${user.username}?tab=follower`} className='mr-5 hover:underline' onClick={onClose}>
                                <span className='font-bold text-black'>{user.status.follower}</span>{' '}
                                <span className='text-gray-500'>Followers</span>
                            </Link>
                        </div>
                    </div>
                    <div className='flex-1' />
                    <div className='flex items-center p-4 border-b border-base-300' onClick={logout}>
                        <LogoutSvg className='w-6 h-6 mr-6' />
                        <span className='text-xl font-bold'>Log out</span>
                    </div>
                </div>
            </div>
        </GlobalPortal>
    );
}
