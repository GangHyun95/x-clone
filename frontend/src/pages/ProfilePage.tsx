import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PageLayout from '@/components/layout/PageLayout';
import { CalendarSvg } from '@/components/svgs';
import PostCard from '@/components/postcard';
import { useUserProfile } from '@/queries/user';
import { formatJoinDate } from '@/utils/formatters';
import { getCurrentUser } from '@/store/authStore';
import FollowButton from '@/components/common/FollowButton';

export default function ProfilePage() {
    const { nickname } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') === 'like' ? 'like' : 'post';

    const me = getCurrentUser();
    const { data: user } = useUserProfile(nickname ?? '');
    
    const isMe = me?.nickname === nickname;

    if (!user) {
        return (
            <div className="p-4 text-center text-gray-500">
                존재하지 않는 사용자입니다.
            </div>
        );
    }
    const current = isMe ? me : user;

    const tabs = [
        { label: 'posts', active: tab === 'post', onClick: () => setSearchParams({ tab: 'post' }) },
        { label: 'likes', active: tab === 'like', onClick: () => setSearchParams({ tab: 'like' }) },
    ];
    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>
                    <div className='flex flex-col items-start font-medium'>
                        <h3 className='font-medium py-0.5'>{current.full_name}</h3>
                        <span className='text-xs text-gray-500'>{current.post_count} post</span>
                    </div>
                </StickyHeader.Header>
            </StickyHeader>
            <PageLayout.Content>
                <section className='flex flex-col'>
                    <div className='relative bg-slate-300 z-0'>
                        <div className='pb-[calc(100%/3)]' />
                        <div className='absolute inset-0'>
                            {current.cover_img && <img src={current.cover_img} alt="cover_img" />}
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
                                    <FollowButton id={user.id} nickname={user.nickname} is_following={user.is_following}/>
                                )}
                            </div>
                        </div>
                        <div className='flex flex-col mt-1 mb-3'>
                            <span className='text-xl font-bold'>{user.full_name}</span>
                            <span className='text-gray-500'>@{user.nickname}</span>
                        </div>
                        <div className='flex items-center mb-3'>
                            <span><CalendarSvg className='size-5 fill-gray-500 mr-1'/></span>
                            <span className='text-gray-500'>{formatJoinDate(user.created_at)}</span>
                        </div>
                        <div className='flex text-sm'>
                            <div className='mr-5'>
                                <span className='font-bold text-black'>{current.status.following} </span>
                                <span className='text-gray-500'>Following</span>
                            </div>
                            <div className='mr-5'>
                                <span className='font-bold text-black'>{current.status.follower} </span>
                                <span className='text-gray-500'>Follower</span>
                            </div>
                        </div>
                    </div>
                </section>
                <section>
                    <Tabs tabs={tabs} />
                </section>
                <section>
                    <PostCard
                        user={user}
                        content='자녀분이 선물을 받고 기뻐하시겠어요.'
                        image='/test.jpeg'
                        created_at='2025-06-04T12:30:00.000Z'
                        counts={{ comment: 3, like: 523 }}
                    />
                </section>
            </PageLayout.Content>
        </PageLayout>
    );
}
