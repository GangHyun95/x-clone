import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import { HeartSvg, UserSvg } from '@/components/svgs';
import type { Notification } from '@/types/notification';
import { formatTimeFromNow } from '@/utils/formatters';

export default function NotificationCard(notification: Notification) {
    const { type, user, post, created_at } = notification;
    const [aspectRatio, setAspectRatio] = useState(100);
    const navigate = useNavigate();

    useEffect(() => {
        if (!post?.img) return;
        const image = new Image();
        image.src = post?.img;
        image.onload = () => {
            const ratio = (image.height / image.width) * 100;
            setAspectRatio(ratio)
        };
    }, [post?.img])

    const iconMap = {
        like: <HeartSvg filled className='size-8 fill-red-500' />,
        follow: <UserSvg filled className='size-8 fill-primary' />,
    };

    const href = type === 'follow' ? `/profile/${user.nickname}` : '#';

    return (
        <article className='border-b border-base-300 px-4 py-3 hover:bg-base-300 cursor-pointer' onClick={() => navigate(href)}>
            <div className='flex'>
                <div className='mr-2'>{iconMap[type]}</div>
                <div className='flex flex-col grow pr-5 min-w-0'>
                    <Avatar nickname='테스트' src={user.profile_img} className='mb-3' />
                    {type === 'like' && (
                        <>
                            <p>{`${user.nickname} liked your post`}</p>
                            <div>
                                {post.content && (
                                    <span className='mt-3 text-gray-500 whitespace-pre-wrap break-words'>{post.content}</span>
                                )}
                                {post.img && (
                                    <figure className='relative mt-3 border border-gray-300 rounded-2xl overflow-hidden'>
                                        <div className='w-full' style={{ paddingBottom: `${aspectRatio}%` }} />
                                        <img
                                            src={post.img}
                                            alt='notification-post'
                                            className='absolute inset-0 w-full h-full object-cover'
                                        />
                                    </figure>
                                )}
                            </div>
                        </>
                    )}

                    {type === 'follow' && (
                        <>
                            <p>{`${user.nickname} started following you.`}</p>
                            <span className='mt-3 text-gray-500'>{formatTimeFromNow(created_at)}</span>
                        </>
                    )}

                </div>
            </div>
        </article>
    );
}
