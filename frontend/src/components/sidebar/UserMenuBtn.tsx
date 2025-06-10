import { useEffect, useRef, useState } from 'react';

import Avatar from '@/components/common/Avatar';
import { MoreSvg } from '@/components/svgs';
import { getCurrentUser } from '@/store/authStore';

import UserMenuDropdown from './UserMenuDropdown';

export default function UserMenuBtn() {
    const me = getCurrentUser();
    const btnRef = useRef<HTMLButtonElement>(null);
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ bottom: 0, left: 0 });

    const calculatePosition = () => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        setPosition({
            bottom: window.innerHeight - rect.top,
            left: rect.left,
        });
    };

    const toggleMenu = () => {
        if (!open) calculatePosition();
        setOpen(!open);
    };

    useEffect(() => {
        if (!open) return;

        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                calculatePosition();
            }, 150);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, [open]);

    return (
        <>
            <button
                ref={btnRef}
                onClick={toggleMenu}
                className='btn btn-ghost btn-circle gap-0 w-max p-3 h-auto border-none xl:w-full'
            >
                <Avatar
                    src={me.profile_img}
                />

                <div className='mx-3 hidden xl:flex flex-col flex-1 min-w-0 text-start'>
                    <span className='truncate whitespace-nowrap font-semibold'>
                        {me.full_name}
                    </span>
                    <span className='truncate whitespace-nowrap text-gray-500 font-normal'>
                        @{me.nickname}
                    </span>
                </div>

                <div className='hidden xl:flex flex-col'>
                    <MoreSvg className='w-5 h-5 self-end' />
                </div>
            </button>
            <UserMenuDropdown 
                open={open}
                position={position}
                onClose={() => setOpen(false)}
                nickname={me.nickname}
            />
        </>
    );
}
