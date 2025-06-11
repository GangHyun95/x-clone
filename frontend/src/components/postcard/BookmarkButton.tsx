import toast from 'react-hot-toast';

import { BookmarkSvg } from '@/components/svgs';
import { queryClient } from '@/lib/queryClient';
import { useBookmarkPost } from '@/queries/post';
import type { Post } from '@/types/post';

export default function BookmarkButton({ id, is_bookmarked }: { id: number, is_bookmarked: boolean }) {
    const { mutate: bookmarkPost } = useBookmarkPost();
    const handleToggleBookmark = () => {
        bookmarkPost({ id }, {
            onSuccess: (data) => {
                toast.success(data.message);
                queryClient.setQueryData<Post[]>(['posts'], (old) => {
                    if (!old) return old;
                    return old.map((post) => {
                        if (post.id !== id) return post;
                        const bookmarked = !post.is_bookmarked;
                        return {
                            ...post,
                            is_bookmarked: bookmarked,
                        };
                    });
                });
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
