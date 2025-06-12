import toast from 'react-hot-toast';

import { HeartSvg } from '@/components/svgs';
import { useLikePost } from '@/queries/post';
import { updatePostCacheById } from '@/lib/queryCacheHelpers';

type Props = {
    id: number;
    is_liked: boolean;
    likeCount: number;
}
export default function LikeButton({ id: postId, is_liked, likeCount }: Props) {
    const { mutate: likePost } = useLikePost();
    const handleToggleLike = () => {
        likePost({ postId }, {
            onSuccess: (data) => {
                toast.success(data.message);
                updatePostCacheById(postId, (post) => {
                    const liked = post.is_liked;
                    return {
                        ...post,
                        is_liked: !liked,
                        counts: {
                            ...post.counts,
                            like: liked ? post.counts.like - 1 : post.counts.like + 1,
                        },
                    };
                });
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
            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-red-500/10'>
                <HeartSvg filled={is_liked} className={`h-5 group-hover:fill-red-500 ${is_liked ? 'fill-red-500' : 'fill-gray-500'}`} />
            </button>
            <span className={`text-sm px-1 ${is_liked ? 'text-red-500' : ''}`}>{likeCount}</span>
        </div>
    );
}