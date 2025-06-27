import { useState } from 'react';

import Avatar from '@/components/common/Avatar';
import MobileSidebar from '@/components/mobile/MobileSidebar';
import { BackArrowSvg } from '@/components/svgs';
import { useMobileHeaderSlideProgress } from '@/hooks/useMobileHeaderSlide';
import { getCurrentUser } from '@/store/authStore';


export default function StickyHeader({ children }: { children: React.ReactNode }) {
    const progress = useMobileHeaderSlideProgress(160);

    return (
        <div
            style={{
                transform: `translateY(-${progress * 100}%)`,
                willChange: 'transform',
            }}
            className='sticky top-0 z-10 bg-white/85 backdrop-blur-md transition-transform duration-75 ease-out'
        >
            {children}
        </div>
    );
}

StickyHeader.Header = function Header({ children, onPrev, showAvatarOnMobile = true }: { children: React.ReactNode; onPrev?: () => void, showAvatarOnMobile?: boolean }) {
    const [open, setOpen] = useState(false);
    const me = getCurrentUser();
    return (
        <>
            <div className='flex items-center px-4 h-[53px]'>
                <div className={`min-w-[53px] ${showAvatarOnMobile ? 'block xs:hidden' : 'hidden'}`}>
                    <button
                        onClick={() => setOpen(true)}
                        className='btn btn-ghost btn-circle min-w-6 min-h-6'
                    >
                        <Avatar src={me.profile_img} />
                    </button>
                </div>
                {onPrev && (
                    <div className={`min-w-[53px] ${showAvatarOnMobile ? 'hidden xs:block' : ''}`}>
                        <button type='button' onClick={onPrev} className='btn btn-ghost btn-circle min-w-6 min-h-6 -m-2'>
                            <BackArrowSvg className='size-5' />
                        </button>
                    </div>
                )}
                <h2 className='flex flex-col justify-center shrink-1 grow text-xl font-bold h-full min-w-0'>{children}</h2>
            </div>
            <MobileSidebar open={open} onClose={() => setOpen(false)} user={me} />
        </>
    );
};

