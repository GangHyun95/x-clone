import Avatar from '@/components/Avatar';
import { BookmarkSvg, CommentSvg, HeartSvg, ShareSvg } from '@/components/svgs';
import { formatTimeFromNow } from '@/utils/formatters';

type Props = {
    user: { profile_img: string; name: string; nickname: string; }
    content: string;
    image?: string;
    created_at: string;
    counts: {
        comment: number;
        like: number;
    }
};

export default function PostCard({ user, content, image, created_at, counts }: Props) {
    return (
        <article className='flex flex-col px-4 py-3 border-b border-base-300'>
            <div className='flex'>
                <div className='mr-2'>
                    <Avatar src={user.profile_img} />
                </div>
                <div className='flex grow flex-col'>
                    <div>
                        <ul className='flex items-center'>
                            <li><span className='font-extrabold'>{user.name}</span></li>
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
                    {image && (
                        <figure className='relative mt-3 cursor-pointer border border-base-300'>
                            <div className='w-full pb-[100%]' />
                            <img src={image} alt='post' className='absolute inset-0' />
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
                            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-red-500/10'>
                                <HeartSvg className='h-5 fill-gray-500 group-hover:fill-red-500' />
                            </button>
                            <span className='text-sm px-1'>{counts.like}</span>
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

