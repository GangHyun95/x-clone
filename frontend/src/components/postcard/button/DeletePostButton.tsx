import toast from 'react-hot-toast';

import { TrashSvg } from '@/components/svgs';
import { queryClient } from '@/lib/queryClient';
import { useDeletePost } from '@/queries/post';
import type { Post } from '@/types/post';

type Props = {
    postId: number;
    onClose: () => void;
};

export default function DeletePostButton({ postId, onClose }: Props) {
    const { mutate: deletePost } = useDeletePost();
    
    const handleDeletePost = () => {
        deletePost({ id: postId }, {
            onSuccess: (data) => {
                toast.success(data.message);
                onClose();

                queryClient.setQueryData<Post[]>(['posts'], (old) => {
                    if (!old ) return old;
                    return old.filter((post) => post.id !== postId);
                });
            },
            onError: ({ message }) => {
                console.error(message);
            },
        });
    };
    return (
        <button
            className='flex items-center w-full px-4 py-3 hover:bg-base-300 cursor-pointer font-bold'
            onClick={handleDeletePost}
        >
            <div className='pr-3'>
                <TrashSvg className='size-5 fill-red-500' />
            </div>
            <div className='text-red-500'>Delete</div>
        </button>
    );
}
