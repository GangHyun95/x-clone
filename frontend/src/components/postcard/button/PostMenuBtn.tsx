import PostMenuDropDown from '@/components/postcard/PostMenuDropDown';
import { MoreSvg } from '@/components/svgs';
import useDropdownPosition from '@/hooks/useDropdownPosition';
import type { UserPreview } from '@/types/user';

type Props = {
    user: UserPreview;
    open: boolean;
    onToggle: () => void;
    postId: number;
};

export default function PostMenuBtn({ user, open, onToggle, postId }: Props) {
    const { btnRef, position } = useDropdownPosition({ open, alignment: 'right' });

    return (
        <>
            <button
                ref={btnRef}
                onClick={onToggle}
                className='btn btn-ghost btn-circle btn-sm hover:bg-primary/10 border-0 group'
            >
                <MoreSvg className='size-5 fill-gray-500 group-hover:fill-primary' />
            </button>
            <PostMenuDropDown
                open={open}
                position={position}
                onClose={() => onToggle()}
                user={user}
                postId={postId}
            />
        </>
    );
}
