import toast from 'react-hot-toast';

import { HeartSvg, SpinnerSvg } from '@/components/svgs';
import { updatePostCacheById, updatePostDetailCache } from '@/lib/queryCacheHelpers';
import { useToggleLike } from '@/queries/post';
import type { Post } from '@/types/post';

type Props = {
    id: number;
    is_liked: boolean;
    likeCount: number;
};

export default function LikeButton({ id: postId, is_liked, likeCount }: Props) {
    const { mutate: toggleLike, isPending } = useToggleLike();

    const handleToggleLike = () => {
        if (isPending) return;

        toggleLike({ postId }, {
                onSuccess: (data) => {
                    toast.success(data.message);

                    const updater = (post: Post) => {
                        const liked = post.is_liked;
                        return {
                            ...post,
                            is_liked: !liked,
                            counts: {
                                ...post.counts,
                                like: Math.max(0, post.counts.like + (liked ? -1 : 1)),
                            },
                        };
                    };

                    updatePostCacheById(postId, updater);
                    updatePostDetailCache(postId, updater);
                },
                onError: (error) => {
                    console.error('Error liking/unliking post:', error);
                },
            });
    };

    return (
        <div 
            className='flex-1 flex items-center cursor-pointer group'
            onClick={handleToggleLike}
        >
            {isPending ? (
                <div className='flex items-center'>
                    <SpinnerSvg className='size-5 animate-spin text-red-500' />
                </div>
            ) : (
                <>
                    <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-red-500/10' disabled>
                        <HeartSvg filled={is_liked} className={`h-5 group-hover:fill-red-500 ${is_liked ? 'fill-red-500' : 'fill-gray-500'}`} />
                    </button>
                    <span className={`text-sm px-1 ${is_liked ? 'text-red-500' : ''}`}>{likeCount}</span>
                </>
            )}
        </div>
    );
}