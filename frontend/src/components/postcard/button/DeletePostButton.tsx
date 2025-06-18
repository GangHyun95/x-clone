import toast from 'react-hot-toast';

import { TrashSvg } from '@/components/svgs';
import { removePostFromCache } from '@/lib/queryCacheHelpers';
import { useDelete } from '@/queries/post';

type Props = {
    postId: number;
    onClose: () => void;
};

export default function DeletePostButton({ postId, onClose }: Props) {
    const { mutate: deletePost } = useDelete();
    
    const handleDeletePost = () => {
        deletePost({ postId }, {
            onSuccess: (data) => {
                toast.success(data.message);
                onClose();
                removePostFromCache(postId);
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
