import { useEffect, useState } from 'react';

import Avatar from '@/components/common/Avatar';
import PostMenuBtn from '@/components/postcard/button/PostMenuBtn';
import { CommentSvg, ShareSvg } from '@/components/svgs';
import type { Post } from '@/types/post';
import { formatTimeFromNow } from '@/utils/formatters';

import { BookmarkButton, LikeButton } from './button';

type Props = Post & {
    openPostId: number | null;
    setOpenPostId: (id: number | null) => void;
}
export default function PostCard({ openPostId, setOpenPostId, ...post }: Props) {
    const {id, img, user, created_at, content, counts, is_liked, is_bookmarked} = post;
    const [aspectRatio, setAspectRatio] = useState(100);
    const isOpen = openPostId === id;
    const handleToggleMenu = () => {
        setOpenPostId(isOpen ? null : id);
    }

    useEffect(() => {
        if (!img) return;
        const image = new Image();
        image.src = img;
        image.onload = () => {
            const ratio = (image.height / image.width) * 100;
            setAspectRatio(ratio);
        }
    }, [img])
    return (
        <article className='flex flex-col px-4 py-3 border-b border-base-300'>
            <div className='flex'>
                <div className='mr-2'>
                    <Avatar nickname={user.nickname} src={user.profile_img} />
                </div>
                <div className='flex grow flex-col'>
                    <div className='flex justify-between'>
                        <ul className='flex items-center'>
                            <li><span className='font-extrabold'>{user.full_name}</span></li>
                            <li className='ml-1.5 text-gray-500'>
                                <span>@{user.nickname}</span>
                                <span className='px-1'>·</span>
                                <time dateTime={created_at}>{formatTimeFromNow(created_at)}</time>
                            </li>
                        </ul>
                        <PostMenuBtn open={isOpen} onToggle={handleToggleMenu} user={post.user} postId={id} />
                    </div>
                    <div className='flex flex-col'>
                        <p>{content}</p>
                    </div>
                    {img && (
                        <figure className='relative mt-3 cursor-pointer border border-base-300 rounded-2xl overflow-hidden'>
                            <div className='w-full' style={{ paddingBottom: `${aspectRatio}%` }} />
                            <img src={img} alt='post' className='absolute inset-0 w-full h-full' />
                        </figure>
                    )}
                    <footer className='mt-3 flex justify-between gap-1'>
                        <div className='flex-1 flex items-center cursor-pointer group'>
                            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                                <CommentSvg className='h-5 fill-gray-500 group-hover:fill-primary' />
                            </button>
                            <span className='text-sm px-1'>{counts.comment}</span>
                        </div>
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

