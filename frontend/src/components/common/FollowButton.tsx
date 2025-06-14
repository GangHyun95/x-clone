import toast from 'react-hot-toast';

import { useToggleFollow } from '@/queries/user';
import { queryClient } from '@/lib/queryClient';
import type { User, UserSummary } from '@/types/user';
import { useParams } from 'react-router-dom';

type Props = {
    id: number;
    nickname: string;
    is_following: boolean;
}

export default function FollowButton({ id: userId, nickname, is_following }: Props) {
    const { mutate: toggleFollow } = useToggleFollow();
    const { nickname: excluded = 'default' } = useParams();
    const handleFollowToggle = () => {
        toggleFollow({ userId }, {
            onSuccess: (data) => {
                const isNowFollowing = data.data.is_following;
                toast.success(data.message);

                queryClient.setQueryData(['users', 'suggested', excluded], (old: UserSummary[]) => {
                    if (!old) return old;
                    return old.map((user) =>
                        user.id === userId
                            ? { ...user, is_following: !user.is_following }
                            : user
                    );
                });

                queryClient.setQueryData(['user', nickname], (old: User) => {
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

                queryClient.setQueryData(['me'], (old: User) => {
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
        <button className={`${baseClass} ${followingClass}`} onClick={handleFollowToggle}>
            {is_following ? (
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
