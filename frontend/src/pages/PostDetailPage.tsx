import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import StickyHeader from '@/components/common/StickyHeader';
import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { BookmarkButton, CommentButton, LikeButton } from '@/components/postcard/button';
import PostMenuBtn from '@/components/postcard/button/PostMenuBtn';
import { ShareSvg } from '@/components/svgs';
import { useImageAspectRatio } from '@/hooks/useImageAspectRatio';
import { usePost, useChildrenPosts } from '@/queries/post';
import { formatPostTimestamp } from '@/utils/formatters';

export default function PostDetailPage() {
    const navigate = useNavigate();
    const postId = Number(useParams().postId ?? '');

    const { data: post } = usePost(postId);
    const { data: comments = [] } = useChildrenPosts(postId);

    const aspectRatio = useImageAspectRatio(post?.img);
    const formattedTime = useMemo(() => formatPostTimestamp(post?.created_at || ''), [post?.created_at]);

    if (!post) return null;

    const { user, content, img, counts, is_liked, is_bookmarked } = post;

    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>Post</StickyHeader.Header>
            </StickyHeader>

            <PageLayout.Content>
                <article className='flex flex-col px-4 py-3 border-b border-base-300'>
                    <div className='flex'>
                        <div className='mr-2'>
                            <Avatar username={user.username} src={user.profile_img} />
                        </div>
                        <div className='flex flex-auto justify-between'>
                            <ul className='flex flex-col items-start'>
                                <li><span className='font-extrabold'>{user.full_name}</span></li>
                                <li className='text-gray-500'>@{user.username}</li>
                            </ul>
                            <PostMenuBtn user={user} postId={postId} />
                        </div>
                    </div>

                    <div>
                        <div className='flex flex-col'>
                            <p className='whitespace-pre-wrap break-words text-lg'>{content}</p>
                        </div>

                        <div className='flex grow flex-col min-w-0'>
                            {img && (
                                <figure className='relative mt-3 cursor-pointer border border-gray-300 rounded-2xl overflow-hidden bg-white'>
                                    <div className='w-full' style={{ paddingBottom: `${aspectRatio}%` }} />
                                    <img src={img} alt='post' className='absolute inset-0 w-full h-full object-cover' />
                                </figure>
                            )}

                            <p className='mt-4 py-4 border-y border-base-300 text-gray-500'>{formattedTime}</p>

                            <footer className='mt-3 flex justify-between items-center gap-1'>
                                {!post.parent_id && (
                                    <CommentButton id={postId} commentCount={counts.comment} />
                                )}
                                <LikeButton id={postId} is_liked={is_liked} likeCount={counts.like} />
                                <BookmarkButton id={postId} is_bookmarked={is_bookmarked} />
                                <div className='flex items-center cursor-pointer group'>
                                    <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                                        <ShareSvg className='h-5 fill-gray-500 group-hover:fill-primary' />
                                    </button>
                                </div>
                            </footer>
                        </div>
                    </div>
                </article>

                {!post.parent_id && (
                    <PostEditorForm postId={postId} placeholder='Post your reply' />
                )}

                {comments.map((comment) => (
                    <PostCard key={comment.id} post={comment} />
                ))}
            </PageLayout.Content>
        </PageLayout>
    );
}
