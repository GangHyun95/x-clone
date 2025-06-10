import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { SpinnerSvg } from '@/components/svgs';
import { useLogout } from '@/hooks/auth/useAuth';
import { queryClient } from '@/lib/queryClient';
import GlobalPortal from '@/portals/GlobalPortal';

type Props = {
    open: boolean;
    position: { bottom: number; left: number };
    onClose: () => void;
    nickname: string;
};

export default function UserMenuDropdown({ open, position, onClose, nickname }: Props) {
    const navigate = useNavigate();

    const { logout, isLoggingOut} = useLogout({
        onSuccess: () => {
            queryClient.clear();
            navigate('/');
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
                <div className='fixed inset-0 flex items-center justify-center z-50 bg-white'>
                    <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
                </div>
            </GlobalPortal>
        )
    }

    return (
        <GlobalPortal>
            <div className='absolute inset-0 z-10'>
                <div className='fixed inset-0 z-0' onClick={onClose} />

                <div
                    className='fixed border border-base-300 shadow-md rounded-2xl w-[300px] z-0 bg-white'
                    style={{
                        bottom: `${position.bottom}px`,
                        left: `${position.left}px`,
                    }}
                >
                    <div className='flex flex-col py-3'>
                        <div
                            className='px-4 py-3 hover:bg-base-300 cursor-pointer font-bold'
                            onClick={logout}
                        >
                            Log out @{nickname}
                        </div>
                    </div>
                </div>
            </div>
        </GlobalPortal>
    );
}
