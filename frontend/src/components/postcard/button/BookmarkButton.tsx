import { useState } from 'react';
import toast from 'react-hot-toast';

import { BookmarkSvg } from '@/components/svgs';
import { useBookmarkPost } from '@/queries/post';

export default function BookmarkButton({ id: postId, is_bookmarked }: { id: number, is_bookmarked: boolean }) {
    const [bookmarked, setBookmarked] = useState(is_bookmarked);
    const { mutate: bookmarkPost } = useBookmarkPost();
    const handleToggleBookmark = () => {
        setBookmarked(prev => !prev);
        bookmarkPost({ postId }, {
            onSuccess: (data) => {
                toast.success(data.message);
            },
            onError: (error) => {
                setBookmarked(prev => !prev);
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
                <BookmarkSvg filled={bookmarked} className={`h-5 group-hover:fill-primary ${bookmarked ? 'fill-primary' : 'fill-gray-500'}`} />
            </button>
        </div>
    );
}
