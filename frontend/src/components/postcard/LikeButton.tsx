import toast from 'react-hot-toast';

import { HeartSvg } from '@/components/svgs';
import { queryClient } from '@/lib/queryClient';
import { useLikeUnlikePost } from '@/queries/post';
import type { Post } from '@/types/post';

type Props = {
    id: number;
    is_liked: boolean;
    likeCount: number;
}
export default function LikeButton({ id, is_liked, likeCount }: Props) {
    const { mutate: likeUnlikePost } = useLikeUnlikePost();
    const handleLikeUnlike = () => {
        likeUnlikePost({ id }, {
            onSuccess: (data) => {
                toast.success(data.message)
                queryClient.setQueryData<Post[]>(['posts'], (old) => {
                    if (!old) return old;
                    return old.map((post) => {
                        if (post.id !== id) return post;
                        const liked = !post.is_liked;
                        const newLikeCount = liked ? likeCount + 1 : likeCount - 1;
                        return {
                            ...post,
                            is_liked: liked,
                            counts: {
                                ...post.counts,
                                like: newLikeCount,
                            },
                        };
                    });
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
            onClick={handleLikeUnlike}
        >
            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-red-500/10'>
                <HeartSvg filled={is_liked} className={`h-5 group-hover:fill-red-500 ${is_liked ? 'fill-red-500' : 'fill-gray-500'}`} />
            </button>
            <span className={`text-sm px-1 ${is_liked ? 'text-red-500' : ''}`}>{likeCount}</span>
        </div>
    );
}