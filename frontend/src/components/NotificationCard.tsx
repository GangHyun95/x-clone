import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import { HeartSvg, UserSvg } from '@/components/svgs';
import { useImageAspectRatio } from '@/hooks/useImageAspectRatio';
import type { Notification } from '@/types/notification';
import { formatTimeFromNow } from '@/utils/formatters';

export default function NotificationCard(notification: Notification) {
    const { type, user, post, created_at } = notification;
    const navigate = useNavigate();
    const aspectRatio = useImageAspectRatio(post?.img);

    const iconMap = {
        like: <HeartSvg filled className='size-8 fill-red-500' />,
        comment_like: <HeartSvg filled className='size-8 fill-red-500' />,
        follow: <UserSvg filled className='size-8 fill-primary' />,
    };

    const href = type === 'follow' ? `/profile/${user.username}` : `/posts/${post?.id}`;

    return (
        <article className='border-b border-base-300 px-4 py-3 hover:bg-base-300 cursor-pointer' onClick={() => navigate(href)}>
            <div className='flex'>
                <div className='mr-2'>{iconMap[type]}</div>
                <div className='flex flex-col grow pr-5 min-w-0'>
                    <Avatar username={user.username} src={user.profile_img} className='mb-3' />
                    {(type === 'like' || type === 'comment_like') && (
                        <>
                            <p>{`${user.username} liked your ${type === 'comment_like' ? 'comment' : 'post'}`}</p>

                            {post?.content && (
                                <span className='mt-3 text-gray-500 whitespace-pre-wrap break-words'>{post.content}</span>
                            )}
                            {post?.img && (
                                <figure className='relative mt-3 border border-gray-300 rounded-2xl overflow-hidden bg-white'>
                                    <div className='w-full' style={{ paddingBottom: `${aspectRatio}%` }} />
                                    <img
                                        src={post.img}
                                        alt='notification-post'
                                        className='absolute inset-0 w-full h-full object-cover'
                                    />
                                </figure>
                            )}
                        </>
                    )}

                    {type === 'follow' && (
                        <>
                            <p>{`${user.username} started following you.`}</p>
                            <span className='mt-3 text-gray-500'>{formatTimeFromNow(created_at)}</span>
                        </>
                    )}

                </div>
            </div>
        </article>
    );
}
