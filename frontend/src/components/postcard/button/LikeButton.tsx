import { useState } from 'react';
import toast from 'react-hot-toast';

import { HeartSvg } from '@/components/svgs';
import { useLikePost } from '@/queries/post';

type Props = {
    id: number;
    is_liked: boolean;
    likeCount: number;
}
export default function LikeButton({ id: postId, is_liked, likeCount }: Props) {
    const [liked, setLiked] = useState(is_liked);
    const [count, setCount] = useState(likeCount);

    const { mutate: likePost } = useLikePost();
    const handleToggleLike = () => {
        const prevLiked = liked;
        const prevCount = count;

        const nextLiked = !prevLiked;
        const nextCount = nextLiked ? prevCount + 1 : prevCount - 1;

        setLiked(nextLiked);
        setCount(nextCount);

        likePost({ postId }, {
            onSuccess: (data) => {
                toast.success(data.message);
            },
            onError: (error) => {
                console.error('Error liking/unliking post:', error);
                setLiked(prevLiked);
                setCount(prevCount);
            },
        });
    };

    return (
        <div 
            className='flex-1 flex items-center cursor-pointer group'
            onClick={handleToggleLike}
        >
            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-red-500/10'>
                <HeartSvg filled={liked} className={`h-5 group-hover:fill-red-500 ${liked ? 'fill-red-500' : 'fill-gray-500'}`} />
            </button>
            <span className={`text-sm px-1 ${liked ? 'text-red-500' : ''}`}>{count}</span>
        </div>
    );
}