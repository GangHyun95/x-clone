import { useState } from 'react';

import { MoreSvg } from '@/components/svgs';
import useDropdownPosition from '@/hooks/useDropdownPosition';
import PostMenuDropDown from '@/components/postcard/PostMenuDropDown';
import type { UserPreview } from '@/types/user';

export type PostMenuBtnProps = {
    user: UserPreview;
    postId: number;
};

export default function PostMenuBtn({ user, postId }: PostMenuBtnProps) {
    const [open, setOpen] = useState(false);
    const { btnRef, position } = useDropdownPosition({ open, alignment: 'right' });

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <button
                ref={btnRef}
                onClick={handleClick}
                className='btn btn-ghost btn-circle btn-sm hover:bg-primary/10 border-0 group'
            >
                <MoreSvg className='size-5 fill-gray-500 group-hover:fill-primary' />
            </button>
            {open &&
                <PostMenuDropDown
                    open={true}
                    position={position}
                    onClose={() => setOpen(false)}
                    user={user}
                    postId={postId}
                />
            }
        </>
    );
}
