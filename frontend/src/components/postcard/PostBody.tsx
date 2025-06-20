import { useEffect, useMemo, useState } from 'react';

import type { UserSummary } from '@/types/user';

import { formatTimeFromNow } from '@/utils/formatters';

import PostMenuBtn from './button/PostMenuBtn';

type Props = {
    user: UserSummary;
    content: string;
    created_at: string;
    img?: string;
    postId: number;
    showImageAsLink?: boolean;
    variant?: 'post' | 'comment';
};

export default function PostBody({ user, content, created_at, img, postId, variant = 'post' }: Props) {
    const [aspectRatio, setAspectRatio] = useState(100);
    useEffect(() => {
        if (!img) return;
        const image = new Image();
        image.src = img;
        image.onload = () => {
            const ratio = (image.height / image.width) * 100;
            setAspectRatio(ratio);
        };
    }, [img]);
    const formattedTime = useMemo(() => formatTimeFromNow(created_at), [created_at]);

    return (
        <>
            <div className='flex justify-between'>
                <ul className='flex items-center'>
                    <li><span className='font-extrabold'>{user.full_name}</span></li>
                    <li className='ml-1.5 text-gray-500'>
                        <span>@{user.username}</span>
                        <span className='px-1'>·</span>
                        <time dateTime={created_at}>{formattedTime}</time>
                    </li>
                </ul>
                {variant === 'post' && <PostMenuBtn user={user} postId={postId} />}
            </div>
            <div className='flex flex-col'>
                <p className='whitespace-pre-wrap break-words'>{content}</p>
            </div>
            {img && (
                variant === 'comment' ? (
                    <div className='mt-3'>
                        <a
                            href={img}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-primary hover:underline break-all text-sm'
                        >
                            {img}
                        </a>
                    </div>
                ) : (
                    <figure className='relative mt-3 cursor-pointer border border-gray-300 rounded-2xl overflow-hidden'>
                        <div className='w-full' style={{ paddingBottom: `${aspectRatio}%` }} />
                        <img src={img} alt='post' className='absolute inset-0 w-full h-full object-cover' />
                    </figure>
                )
            )}
        </>
    );
}
