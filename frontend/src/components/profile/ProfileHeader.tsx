import { Link } from 'react-router-dom';

import FollowButton from '@/components/common/FollowButton';
import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import CoverImageSection from '@/components/profile/CoverImageSection';
import ProfileImageSection from '@/components/profile/ProfileImageSection';
import { CalendarSvg, LinkSvg } from '@/components/svgs';
import type { User } from '@/types/user';
import { formatJoinDate, formatLinkDisplay } from '@/utils/formatters';

export default function ProfileHeader({ user, isMe }: { user: User; isMe: boolean }) {
    return (
        <section className='flex flex-col'>
            <CoverImageSection src={user.cover_img} />
            <div className='px-4 pt-3 mb-4 flex flex-col'>
                <div className='flex items-start justify-between'>
                    <ProfileImageSection src={user.profile_img} />
                    <div className='flex'>
                        {isMe ? (
                            <ModalRouteBtn
                                to={'/settings/profile'}
                                backgroundLocation={location.pathname}
                                className='btn text-base btn-ghost btn-circle border-gray-300 px-4 mb-3 w-auto h-auto min-h-9'
                            >
                                <span>Edit Profile</span>
                            </ModalRouteBtn>
                        ) : (
                            <FollowButton id={user.id} username={user.username} is_following={user.is_following} />
                        )}
                    </div>
                </div>
                <div className='flex flex-col mt-1 mb-3'>
                    <span className='text-xl font-bold'>{user.full_name}</span>
                    <span className='text-gray-500'>@{user.username}</span>
                </div>
                {user.bio && (
                    <div className='mb-3 whitespace-pre-wrap break-words'>
                        <span>{user.bio}</span>
                    </div>
                )}
                <div className='flex items-center mb-3'>
                    {user.link && (
                        <a
                            href={user.link.startsWith('http') ? user.link : `https://${user.link}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center mr-3 group cursor-pointer'
                        >
                            <span><LinkSvg className='size-5 fill-gray-500 mr-1' /></span>
                            <span className='group-hover:underline text-primary'>{formatLinkDisplay(user.link)}</span>
                        </a>
                    )}
                    <div className='flex items-center'>
                        <span><CalendarSvg className='size-5 fill-gray-500 mr-1' /></span>
                        <span className='text-gray-500'>{formatJoinDate(user.created_at)}</span>
                    </div>
                </div>
                <div className='flex text-sm'>
                    <Link to={`/users/${user.username}?tab=following`} className='mr-5 cursor-pointer hover:underline'>
                        <span className='font-bold text-black'>{user.status.following} </span>
                        <span className='text-gray-500'>Following</span>
                    </Link>

                    <Link to={`/users/${user.username}?tab=follower`} className='mr-5 cursor-pointer hover:underline'>
                        <span className='font-bold text-black'>{user.status.follower} </span>
                        <span className='text-gray-500'>Followers</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
