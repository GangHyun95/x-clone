import toast from 'react-hot-toast';

import { InlineSpinner } from '@/components/common/Spinner';
import { queryClient } from '@/lib/queryClient';
import { useToggleFollow } from '@/queries/user';
import type { User, UserSummary } from '@/types/user';


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
                const isNowFollowing = data.data.is_following;
                toast.success(data.message);
                queryClient.setQueriesData<UserSummary[]>({ queryKey: ['users'] }, (old) => {
                    if (!old) return old;
                    return old.map((user) =>
                        user.id === userId
                            ? { ...user, is_following: !user.is_following }
                            : user
                    );
                });

                queryClient.setQueryData<User>(['user', username], (old) => {
                    if (!old || old.id !== userId) return old;

                    return {
                        ...old,
                        is_following: !old.is_following,
                        status: {
                            ...old.status,
                            follower: Math.max(0, old.status.follower + (!old.is_following ? 1 : -1)),
                        },
                    };
                });

                queryClient.setQueryData<User>(['me'], (old) => {
                    if (!old) return old;
                    return {
                        ...old,
                        status: {
                            ...old.status,
                            following: Math.max(0, old.status.following + (isNowFollowing ? 1 : -1)),
                        }
                    }
                })
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
