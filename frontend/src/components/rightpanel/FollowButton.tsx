import { useState } from 'react';
import toast from 'react-hot-toast';

import { useToggleFollow } from '@/queries/user';

export default function FollowButton({ id: userId }: { id: number }) {
    const [isFollowing, setIsFollowing] = useState(false);
    const { mutate: toggleFollow } = useToggleFollow();

    const handleFollowToggle = () => {
        toggleFollow({ userId }, {
            onSuccess: (data) => {
                toast.success(data.message);
                setIsFollowing((prev) => !prev);
            },
            onError: ({ message }) => {
                console.error(message);
            },
        });
    };

    const baseClass = 'btn btn-sm text-sm px-4 rounded-full transition-colors duration-200';

    const followingClass = isFollowing
        ? 'bg-white text-black border border-base-300 hover:bg-red-50 hover:border-red-500 group'
        : 'btn-secondary text-white';

    return (
        <button className={`${baseClass} ${followingClass}`} onClick={handleFollowToggle}>
            {isFollowing ? (
                <span className='relative block'>
                    <span className='group-hover:hidden'>Following</span>
                    <span className='hidden group-hover:inline text-red-500'>Unfollow</span>
                </span>
            ) : (
                <span>Follow</span>
            )}
        </button>
    );
}
