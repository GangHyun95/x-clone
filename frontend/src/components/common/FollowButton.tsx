import toast from 'react-hot-toast';

import { InlineSpinner } from '@/components/common/Spinner';
import { updateFollowCache } from '@/lib/queryCacheHelpers';
import { useToggleFollow } from '@/queries/user';


type Props = {
    id: number;
    username: string;
    is_following: boolean;
}

export default function FollowButton({ id: userId, username, is_following }: Props) {
    const { mutate: toggleFollow, isPending } = useToggleFollow();
    const handleFollowToggle = () => {
        toggleFollow({ userId }, {
            onSuccess: (data) => {
                toast.success(data.message);
                
                updateFollowCache(userId, username, data.data.is_following);
            },
            onError: ({ message }) => {
                console.error(message);
            },
        });
    };


    const baseClass = 'btn btn-sm text-sm px-4 rounded-full transition-colors duration-200';

    const followingClass = is_following
        ? 'bg-white text-black border border-base-300 hover:bg-red-50 hover:border-red-500 group'
        : 'btn-secondary text-white';

    return (
        <button className={`${baseClass} ${followingClass}`} onClick={handleFollowToggle} disabled={isPending}>
            {isPending ? (
                <InlineSpinner label='Following' />
            ) : is_following ? (
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
