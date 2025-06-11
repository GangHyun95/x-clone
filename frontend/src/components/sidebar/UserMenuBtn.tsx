import { useState } from 'react';

import Avatar from '@/components/common/Avatar';
import { MoreSvg } from '@/components/svgs';
import useDropdownPosition from '@/hooks/useDropdownPosition';
import { getCurrentUser } from '@/store/authStore';

import UserMenuDropdown from './UserMenuDropdown';

export default function UserMenuBtn() {
    const me = getCurrentUser();
    const [open, setOpen] = useState(false);

    const { btnRef, position } = useDropdownPosition({ open, anchor: 'top'});

    const toggleMenu = () => {
        setOpen(prev => !prev);
    };

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
