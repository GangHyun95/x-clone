import { useState } from 'react';

import Avatar from '@/components/common/Avatar';
import MobileSidebar from '@/components/mobile/MobileSidebar';
import { XSvg } from '@/components/svgs';
import { getCurrentUser } from '@/store/authStore';


export default function MobileTopBar() {
    const [open, setOpen] = useState(false);
    const me = getCurrentUser();

    return (
        <>
            <header className='fixed inset-0 z-50 h-[53px] flex justify-center px-4'>
                <div className='flex flex-1 basis-1/2 items-center'>
                    <div onClick={() => {
                        console.log(open);
                        setOpen(true)
                    }}>
                        <Avatar src={me.profile_img} />
                    </div>
                </div>
                <div className='flex flex-auto min-w-8 items-center'>
                    <XSvg />
                </div>

                <div className='flex-1 basis-1/2 min-h-8' />
            </header>

            <MobileSidebar
                open={open}
                onClose={() => setOpen(false)}
                user={me}
            />
        </>
    );
}
