import toast from 'react-hot-toast';

import { BookmarkSvg } from '@/components/svgs';
import { updatePostCacheById } from '@/lib/queryCacheHelpers';
import { useBookmarkPost } from '@/queries/post';

export default function BookmarkButton({ id, is_bookmarked }: { id: number, is_bookmarked: boolean }) {
    const { mutate: bookmarkPost } = useBookmarkPost();
    const handleToggleBookmark = () => {
        bookmarkPost({ id }, {
            onSuccess: (data) => {
                toast.success(data.message);
                updatePostCacheById(id, (post) => ({
                    ...post,
                    is_bookmarked: !post.is_bookmarked,
                }));
            },
            onError: (error) => {
                console.error('Error bookmarking/unbookmarking post:', error);
            },
        })
    }
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
