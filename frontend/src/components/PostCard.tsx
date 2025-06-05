import type { JSX } from 'react';

import Avatar from '@/components/Avatar';
import { formatTimeFromNow } from '@/utils/formatters';

type Props = {
    user: { profile_img: string; name: string; nickname: string; }
    content: string;
    image?: string;
    created_at: string;
    actions: {
        icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
        count?: number;
        color?: string;
    }[];
};

export default function PostCard({ user, content, image, created_at, actions }: Props) {
    return (
        <article className='flex flex-col px-4 py-3 border-b border-base-300'>
            <header className='flex'>
                <div className='mr-2'>
                    <Avatar src={user.profile_img} />
                </div>
                <div className='flex grow flex-col'>
                    <div className='flex items-center'>
                        <span className='font-extrabold'>{user.name}</span>
                        <span className='ml-1.5 text-gray-500'>
                            @{user.nickname} ·{' '}
                            <time dateTime={created_at} className='ml-1'>
                                {formatTimeFromNow(created_at)}
                            </time>
                        </span>
                    </div>
                </div>
            </header>

            <div className='mt-2'>
                <p>{content}</p>
            </div>

            {image && (
                <figure className='relative mt-3 cursor-pointer border border-base-300'>
                    <div className='w-full pb-[100%]' />
                    <img src={image} alt='post' className='absolute inset-0' />
                </figure>
            )}

            <footer className='mt-3 flex justify-between gap-1'>
                {actions.map((el, i) => {
                    const { count, icon: Icon, color = 'primary' } = el;
                    const hoverBgClass =
                        color === 'red-500' ? 'group-hover:bg-red-500/10' : 'group-hover:bg-primary/10';
                    const hoverFillClass =
                        color === 'red-500' ? 'group-hover:fill-red-500' : 'group-hover:fill-primary';

                    return (
                        <div key={i} className='flex-1 flex items-center cursor-pointer group'>
                            <button className={`btn btn-sm btn-ghost btn-circle border-0 ${hoverBgClass}`}>
                                <Icon className={`h-5 fill-gray-500 ${hoverFillClass}`} />
                            </button>
                            {count != null && <span className='text-sm px-1'>{count}</span>}
                        </div>
                    );
                })}
            </footer>
        </article>
    );
}

