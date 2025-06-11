import toast from 'react-hot-toast';

import { HeartSvg } from '@/components/svgs';
import { updatePostCacheById } from '@/lib/queryCacheHelpers';
import { useLikePost } from '@/queries/post';

type Props = {
    id: number;
    is_liked: boolean;
    likeCount: number;
}
export default function LikeButton({ id, is_liked, likeCount }: Props) {
    const { mutate: likePost } = useLikePost();
    const handleToggleLike = () => {
        likePost({ id }, {
            onSuccess: (data) => {
                toast.success(data.message)
                
                updatePostCacheById(id, (post) => {
                    const newLikeCount = post.is_liked ? post.counts.like - 1 : post.counts.like + 1;
                    
                    return {
                        ...post,
                        is_liked: !post.is_liked,
                        counts: {
                            ...post.counts,
                            like: newLikeCount
                        }
                    }
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