import { Link } from 'react-router-dom';

import FollowButton from '@/components/common/FollowButton';
import { CalendarSvg, LinkSvg } from '@/components/svgs';
import type { User } from '@/types/user';
import { formatJoinDate } from '@/utils/formatters';

export default function ProfileHeader({ user, isMe }: { user: User; isMe: boolean }) {
    return (
        <section className='flex flex-col'>
            <div className='relative bg-slate-300 z-0'>
                <div className='pb-[calc(100%/3)]' />
                <div className='absolute inset-0 overflow-hidden'>
                    {user.cover_img && (
                        <img
                            src={user.cover_img}
                            alt='cover_img'
                            className='w-full h-full object-cover'
                        />
                    )}
                </div>
            </div>
            <div className='px-4 pt-3 mb-4 flex flex-col'>
                <div className='flex items-start justify-between'>
                    <div className='relative w-1/4 min-w-12 -mt-[15%] mb-3'>
                        <div className='pb-[100%] w-full'>
                            <div className='absolute inset-0 flex items-center justify-center'>
                                <div className='relative group rounded-full bg-white p-1'>
                                    <div className='relative rounded-full overflow-hidden w-full h-full'>
                                        <img
                                            src={user.profile_img || '/avatar-placeholder.png'}
                                            alt='avatar'
                                            className='w-full h-full object-cover'
                                        />
                                        <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex'>
                        {isMe ? (
                            <button className='btn text-base btn-ghost btn-circle border-gray-300 px-4 mb-3 w-auto h-auto min-h-9'>
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <FollowButton id={user.id} nickname={user.nickname} is_following={user.is_following} />
                        )}
                    </div>
                </div>
                <div className='flex flex-col mt-1 mb-3'>
                    <span className='text-xl font-bold'>{user.full_name}</span>
                    <span className='text-gray-500'>@{user.nickname}</span>
                </div>
                {user.bio && <div className='mb-3'><span>{user.bio}</span></div>}
                <div className='flex items-center mb-3'>
                    {user.link && (
                        <Link to={user.link} className='flex items-center mr-3 group cursor-pointer'>
                            <span><LinkSvg className='size-5 fill-gray-500 mr-1' /></span>
                            <span className='group-hover:underline text-primary'>{user.link}</span>
                        </Link>
                    )}
                    <div className='flex items-center'>
                        <span><CalendarSvg className='size-5 fill-gray-500 mr-1' /></span>
                        <span className='text-gray-500'>{formatJoinDate(user.created_at)}</span>
                    </div>
                </div>
                <div className='flex text-sm'>
                    <div className='mr-5'>
                        <span className='font-bold text-black'>{user.status.following} </span>
                        <span className='text-gray-500'>Following</span>
                    </div>
                    <div className='mr-5'>
                        <span className='font-bold text-black'>{user.status.follower} </span>
                        <span className='text-gray-500'>Follower</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
