import { useNavigate, useParams } from 'react-router-dom';

import PageLayout from '@/components/layout/PageLayout';
import StickyHeader from '@/components/layout/StickyHeader';
import Tabs from '@/components/layout/Tabs';
import PostCard from '@/components/PostCard';
import { CalendarSvg } from '@/components/svgs';
// import { useUserProfile } from '@/queries/user';

export default function ProfilePage() {
    const { nickname } = useParams<{ nickname: string }>();
    console.log(nickname);
    const navigate = useNavigate();

    // const { data, isLoading } = useUserProfile(nickname ?? '');
    // console.log(data);

    const tabs = [
        { label: 'Posts', to: '/profile', active: true },
        { label: 'Likes', to: '/profile', active: false },
    ];

    const user = {
        id: '1',
        full_name: '테스트계정',
        profile_img: '/temp.png',
        name: '테스트계정',
        nickname: 'test',
    };

    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>
                    <div className='flex flex-col items-start font-medium'>
                        <h3 className='font-medium py-0.5'>ㅇㅅㅇ</h3>
                        <span className='text-xs text-gray-500'>1 post</span>
                    </div>
                </StickyHeader.Header>
            </StickyHeader>
            <PageLayout.Content>
                <section className='flex flex-col'>
                    <div className='relative bg-slate-300 z-0'>
                        <div className='pb-[calc(100%/3)]' />
                        <div className='absolute inset-0'></div>
                    </div>
                    <div className='px-4 pt-3 mb-4 flex flex-col'>
                        <div className='flex items-start justify-between'>
                            <div className='relative w-1/4 min-w-12 -mt-[15%] mb-3'>
                                <div className='pb-[100%] w-full'>
                                    <div className='absolute inset-0 flex items-center justify-center'>
                                        <div className='relative group rounded-full bg-white p-1'>
                                            <div className='relative rounded-full overflow-hidden w-full h-full'>
                                                <img
                                                    src='/temp.png'
                                                    alt=''
                                                    className='w-full h-full object-cover'
                                                />
                                                <div className='absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex'>
                                <button className='btn text-base btn-ghost btn-circle border-gray-300 px-4 mb-3 w-auto h-auto min-h-9'>
                                    <span>Edit profile</span>
                                </button>
                            </div>
                        </div>
                        <div className='flex flex-col mt-1 mb-3'>
                            <span className='text-xl font-bold'>ㅇㅅㅇ</span>
                            <span className='text-gray-500'>@hgh6128</span>
                        </div>
                        <div className='flex items-center mb-3'>
                            <span><CalendarSvg className='size-5 fill-gray-500 mr-1'/></span>
                            <span className='text-gray-500'>Joined May 2025</span>
                        </div>
                        <div className='flex text-sm'>
                            <div className='mr-5'>
                                <span className='font-bold text-black'>4 </span>
                                <span className='text-gray-500'>Following</span>
                            </div>
                            <div className='mr-5'>
                                <span className='font-bold text-black'>4 </span>
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
