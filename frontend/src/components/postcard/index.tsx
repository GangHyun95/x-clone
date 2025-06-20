import Avatar from '@/components/common/Avatar';
import PostBody from '@/components/postcard/PostBody';
import { ShareSvg } from '@/components/svgs';
import type { Post } from '@/types/post';

import { BookmarkButton, CommentButton, LikeButton } from './button';

export default function PostCard(post: Post) {
    const { id, img, user, created_at, content, counts, is_liked, is_bookmarked } = post;

    return (
        <article className='flex flex-col px-4 py-3 border-b border-base-300'>
            <div className='flex'>
                <div className='mr-2'>
                    <Avatar username={user.username} src={user.profile_img} />
                </div>
                <div className='flex grow flex-col min-w-0'>
                    <PostBody
                        user={user}
                        content={content}
                        created_at={created_at}
                        img={img}
                        postId={id}
                    />
                    <footer className='mt-3 flex justify-between gap-1'>
                        <CommentButton id={id} commentCount={counts.comment} />
                        <LikeButton id={id} is_liked={is_liked} likeCount={counts.like} />
                        <BookmarkButton id={id} is_bookmarked={is_bookmarked} />
                        <div className='flex-1 flex items-center cursor-pointer group'>
                            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                                <ShareSvg className='h-5 fill-gray-500 group-hover:fill-primary' />
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </article>
    );
}
