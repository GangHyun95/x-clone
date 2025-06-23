import toast from 'react-hot-toast';

import { BookmarkSvg } from '@/components/svgs';
import { updatePostCacheById, updatePostDetailCache } from '@/lib/queryCacheHelpers';
import { useToggleBookmark } from '@/queries/post';
import type { Post } from '@/types/post';

export default function BookmarkButton({ id: postId, is_bookmarked }: { id: number, is_bookmarked: boolean }) {
    const { mutate: toggleBookmark, isPending } = useToggleBookmark();

    const handleToggleBookmark = () => {
        if (isPending) return;
        toggleBookmark({ postId }, {
            onSuccess: (data) => {
                toast.success(data.message);
                const updater = (post: Post) => ({
                    ...post,
                    is_bookmarked: !post.is_bookmarked,
                });

                updatePostCacheById(postId, updater);
                updatePostDetailCache(postId, updater);
            },
            onError: (error) => {
                console.error('Error bookmarking/unbookmarking post:', error);
            },
        });
    };

    return (
        <div
            className='flex-1 flex items-center cursor-pointer group'
            onClick={handleToggleBookmark}
        >
            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                <BookmarkSvg filled={is_bookmarked} className={`h-5 group-hover:fill-primary ${is_bookmarked ? 'fill-primary' : 'fill-gray-500'}`} />
            </button>
        </div>
    );
}
