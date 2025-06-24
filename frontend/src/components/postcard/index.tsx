import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import ShareButton from '@/components/postcard/button/ShareButton';
import PostBody from '@/components/postcard/PostBody';
import type { Post } from '@/types/post';

import { BookmarkButton, CommentButton, LikeButton } from './button';

export default function PostCard({ post }: { post: Post }) {
    const navigate = useNavigate();
    const { id, img, user, created_at, content, counts, is_liked, is_bookmarked } = post;

    return (
        <article className='flex flex-col px-4 py-3 border-b border-base-300 hover:bg-base-200 cursor-pointer' onClick={() => navigate(`/post/${id}`)}>
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
                    <footer className='mt-3 flex justify-between gap-1' onClick={(e) => e.stopPropagation()}>
                        {!post.parent_id && (
                            <CommentButton id={id} commentCount={counts.comment} />
                        )}
                        <LikeButton id={id} is_liked={is_liked} likeCount={counts.like} />
                        <BookmarkButton id={id} is_bookmarked={is_bookmarked} />
                        <ShareButton id={id}/>
                    </footer>
                </div>
            </div>
        </article>
    );
}
