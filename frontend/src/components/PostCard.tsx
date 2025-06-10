import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';

import Avatar from '@/components/Avatar';
import { BookmarkSvg, CommentSvg, HeartSvg, ShareSvg } from '@/components/svgs';
import { queryClient } from '@/lib/queryClient';
import { useLikeUnlikePost } from '@/queries/post';
import type { Post } from '@/types/post';
import { formatTimeFromNow } from '@/utils/formatters';

export default function PostCard({id, img, user, created_at, content, counts, is_liked}: Post) {
    const [aspectRatio, setAspectRatio] = useState(100);
    const { mutate: likeUnlikePost } = useLikeUnlikePost();

    const handleLikeUnlike = () => {
        likeUnlikePost({ id }, {
            onSuccess: (data) => {
                toast.success(data.message)
                queryClient.setQueryData<Post[]>(['posts'], (old) => {
                    if (!old) return old;
                    return old.map((post) => {
                        if (post.id !== id) return post;
                        const liked = !post.is_liked;
                        const likeCount = liked ? post.counts.like + 1 : post.counts.like - 1;
                        return {
                            ...post,
                            is_liked: liked,
                            counts: {
                                ...post.counts,
                                like: likeCount,
                            },
                        };
                    });
                });
            },
            onError: (error) => {
                console.error('Error liking/unliking post:', error);
            },
        });
    };

    useEffect(() => {
        if (!img) return;
        const image = new Image();
        image.src = img;
        image.onload = () => {
            const ratio = (image.height / image.width) * 100;
            setAspectRatio(ratio);
        }
        console.log(aspectRatio);
    }, [img])
    return (
        <article className='flex flex-col px-4 py-3 border-b border-base-300'>
            <div className='flex'>
                <div className='mr-2'>
                    <Avatar nickname={user.nickname} src={user.profile_img} />
                </div>
                <div className='flex grow flex-col'>
                    <div>
                        <ul className='flex items-center'>
                            <li><span className='font-extrabold'>{user.full_name}</span></li>
                            <li className='ml-1.5 text-gray-500'>
                                <span>@{user.nickname}</span>
                                <span className='px-1'>·</span>
                                <time dateTime={created_at}>{formatTimeFromNow(created_at)}</time>
                            </li>
                        </ul>
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

                        <div className='flex-1 flex items-center cursor-pointer group'>
                            <button
                                className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-red-500/10'
                                onClick={handleLikeUnlike}
                            >
                                <HeartSvg filled={is_liked} className={`h-5 group-hover:fill-red-500 ${is_liked ? 'fill-red-500' : 'fill-gray-500'}`} />
                            </button>
                            <span className={`text-sm px-1 ${is_liked ? 'text-red-500' : ''}`}>{counts.like}</span>
                        </div>

                        <div className='flex-1 flex items-center cursor-pointer group'>
                            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                                <BookmarkSvg className='h-5 fill-gray-500 group-hover:fill-primary' />
                            </button>
                        </div>

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

