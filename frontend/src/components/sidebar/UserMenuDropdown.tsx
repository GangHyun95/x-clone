import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { FullPageSpinner } from '@/components/common/Spinner';
import { useLogout } from '@/hooks/auth/useAuth';
import { queryClient } from '@/lib/queryClient';
import GlobalPortal from '@/portals/GlobalPortal';
import { setAccessToken } from '@/store/authStore';

type Props = {
    open: boolean;
    position: Partial<{
        top: number;
        bottom: number;
        left: number;
        right: number;
    }>;
    onClose: () => void;
    username: string;
};

export default function UserMenuDropdown({ open, position, onClose, username }: Props) {
    const navigate = useNavigate();

    const { logout, isLoggingOut} = useLogout({
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

    if (!open) return;

    if (isLoggingOut) {
        return (
            <GlobalPortal>
                <FullPageSpinner />
            </GlobalPortal>
        )
    }

    return (
        <GlobalPortal>
            <div className='absolute inset-0 z-10'>
                <div className='fixed inset-0 z-0' onClick={onClose} />

                <div
                    className='fixed border border-base-300 shadow-md rounded-2xl w-[300px] z-0 bg-white'
                    style={position}
                >
                    <div className='flex flex-col py-3'>
                        <div
                            className='px-4 py-3 hover:bg-base-300 cursor-pointer font-bold'
                            onClick={logout}
                        >
                            Log out @{username}
                        </div>
                    </div>
                </div>
            </div>
        </GlobalPortal>
    );
}
