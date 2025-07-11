import toast from 'react-hot-toast';

import { useParams } from 'react-router-dom';

import { UserPlusSvg, UserRemoveSvg } from '@/components/svgs';
import { updatePostCacheByUserId, updatePostDetailCache } from '@/lib/queryCacheHelpers';
import { useToggleFollow } from '@/queries/user';

type Props = {
    postAuthorId: number;
    is_following: boolean;
    username: string;
    onClose: () => void;
}
export default function FollowButton({ postAuthorId, is_following, username, onClose }: Props) {
    const { mutate: toggleFollow } = useToggleFollow();

    const postId = Number(useParams().postId ?? '');

    const handleFollowToggle = () => {
        toggleFollow({ userId: postAuthorId }, {
            onSuccess: (data) => {
                toast.success(data.message);
                onClose();

                updatePostCacheByUserId(postAuthorId, (post) => ({
                    ...post,
                    user: {
                        ...post.user,
                        is_following: !post.user.is_following,
                    },
                }));
                if (postId) {
                    updatePostDetailCache(postId, (post) => ({
                        ...post,
                        user: { ...post.user, is_following: !post.user.is_following }
                    }));
                }
            },
            onError: ({ message }) => {
                console.error(message);
            },
        });
    };
    return (
        <button className='flex w-full items-center px-4 py-3 hover:bg-base-300 cursor-pointer font-bold' onClick={handleFollowToggle}>
            <div className='pr-3'>
                {is_following ? (
                    <UserRemoveSvg className='size-5' />
                ) : (
                    <UserPlusSvg className='size-5' />
                )}
            </div>
            <span>
                {is_following ? 'Unfollow' : 'Follow'} @{username}
            </span>
        </button>
    );
}

