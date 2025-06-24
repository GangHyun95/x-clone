import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { InlineSpinner } from '@/components/common/Spinner';
import { TrashSvg } from '@/components/svgs';
import { removePostFromCache } from '@/lib/queryCacheHelpers';
import { useDelete as useDeletePost } from '@/queries/post';

type Props = {
    postId: number;
    onClose: () => void;
};

export default function DeletePostButton({ postId, onClose }: Props) {
    const navigate = useNavigate();
    const { mutate: deletePost, isPending } = useDeletePost();

    const handleDelete = () => {
        deletePost(
            { postId },
            {
                onSuccess: (data) => {
                    toast.success(data.message);
                    removePostFromCache(postId);

                    if (location.pathname === `/post/${postId}`) {
                        navigate(-1);
                    }

                    onClose();
                },
                onError: ({ message }) => {
                    console.error(message);
                    toast.error('삭제에 실패했습니다.');
                },
            }
        );
    };

    return (
        <button
            className='flex items-center w-full px-4 py-3 hover:bg-base-300 cursor-pointer font-bold'
            onClick={handleDelete}
        >
            {isPending ? (
                <InlineSpinner label='Deleting' color='red-500' />
            ) : (
                <>
                    <TrashSvg className='size-5 fill-red-500' />
                    <span className='text-red-500 ml-1'>Delete</span>
                </>
            )}
        </button>
    );
}
