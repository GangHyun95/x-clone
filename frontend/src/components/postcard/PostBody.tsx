import { useMemo } from 'react';

import { useImageAspectRatio } from '@/hooks/useImageAspectRatio';
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
    showMenuBtn?: boolean;
};

export default function PostBody({ user, content, created_at, img, postId, showImageAsLink = false, showMenuBtn = true }: Props) {
    const aspectRatio = useImageAspectRatio(img);
    const formattedTime = useMemo(() => formatTimeFromNow(created_at), [created_at]);

    return (
        <>
            <div className='flex justify-between'>
                <ul className='flex items-center flex-1 min-w-0'>
                    <li className='truncate whitespace-nowrap font-extrabold'>
                        {user.full_name}
                    </li>
                    <li className='ml-1.5 text-gray-500'>
                        <span>@{user.username}</span>
                        <span className='px-1'>·</span>
                        <time className='whitespace-nowrap' dateTime={created_at}>{formattedTime}</time>
                    </li>
                </ul>
                {showMenuBtn && <PostMenuBtn user={user} postId={postId} />}
            </div>
            <div className='flex flex-col'>
                <p className='whitespace-pre-wrap break-words'>{content}</p>
            </div>
            {img && (
                showImageAsLink ? (
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
                    <figure className='relative mt-3 cursor-pointer border border-gray-300 rounded-2xl overflow-hidden bg-white'>
                        <div className='w-full' style={{ paddingBottom: `${aspectRatio}%` }} />
                        <img src={img} alt='post' className='absolute inset-0 w-full h-full object-cover' />
                    </figure>
                )
            )}
        </>
    );
}
