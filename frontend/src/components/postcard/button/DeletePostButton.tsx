import toast from 'react-hot-toast';

import { InlineSpinner } from '@/components/common/Spinner';
import { TrashSvg } from '@/components/svgs';
import { removePostFromCache } from '@/lib/queryCacheHelpers';
import { useDelete } from '@/queries/post';

type Props = {
    postId: number;
    onClose: () => void;
};

export default function DeletePostButton({ postId, onClose }: Props) {
    const { mutate: deletePost, isPending } = useDelete();
    
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
            {isPending ? (
                <InlineSpinner label='Deleting' color='red-500' />
            ) : (
                <>
                    <div>
                        <TrashSvg className='size-5 fill-red-500' />
                    </div>
                    <div className='text-red-500 ml-1'>Delete</div>
                </>
            )}
        </button>
    );
}
