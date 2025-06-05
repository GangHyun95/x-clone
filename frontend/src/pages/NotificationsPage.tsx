import { Link } from 'react-router-dom';

import Avatar from '@/components/Avatar';
import StickyHeader from '@/components/layout/StickyHeader';
import Heart from '@/components/svgs/Heart';
import User from '@/components/svgs/User';

export default function NotificationsPage() {
    return (
        <div className='flex flex-col h-full'>
            <StickyHeader>
                <div className='flex px-4'>
                    <h2 className='font-pyeojin py-3 grow text-xl font-bold'>Notifications</h2>
                </div>

                <div className='flex'>
                    <div className='flex grow flex-col items-center justify-center'>
                        <Link to='/notifications' className='relative h-auto w-full grow bn btn-ghost rounded-none border-0 px-4 font-bold'>
                            <span className='py-4'>All</span>
                            <span className='absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-primary' />
                        </Link>
                    </div>
                    <div className='flex grow flex-col items-center justify-center'>
                        <Link to='/notifications' className='relative h-auto w-full grow bn btn-ghost rounded-none border-0 px-4 font-medium text-gray-500'>
                            <span className='py-4'>Likes</span>
                        </Link>
                    </div>
                    <div className='flex grow flex-col items-center justify-center'>
                        <Link to='/notifications' className='relative h-auto w-full grow bn btn-ghost rounded-none border-0 px-4 font-medium text-gray-500'>
                            <span className='py-4'>Follows</span>
                        </Link>
                    </div>
                </div>
            </StickyHeader>
            <div className='w-full max-w-[600px] grow'>
                <div className='flex flex-col'>
                    <article className='border-b border-base-300 px-4 py-3 hover:bg-base-300 cursor-pointer'>
                        <div className='flex'>
                            <div className='mr-2'>
                                <Heart filled={true} className='size-8 fill-red-500'/>
                            </div>
                            <div className='flex flex-col grow pr-5'>
                                <Avatar src='/temp.png' className='mb-3' />
                                <p>ㅇㅅㅇ liked your posts.</p>
                                <span className='mt-3 text-gray-500'>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid, voluptate illum magnam eveniet hic corporis iste nostrum quam autem deleniti quas excepturi totam, perferendis non fuga enim vero magni reiciendis.Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                </span>
                            </div>
                        </div>
                    </article>

                    <article className='border-b border-base-300 px-4 py-3 hover:bg-base-300 cursor-pointer'>
                        <div className='flex'>
                            <div className='mr-2'>
                                <User filled={true} className='size-8 fill-primary'/>
                            </div>
                            <div className='flex flex-col grow pr-5'>
                                <Avatar src='/temp.png' className='mb-3' />
                                <p>ㅇㅅㅇ started following you.</p>
                                <span className='mt-3 text-gray-500'>
                                    May 23, 2025
                                </span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
            {/* <div className='max-w-[400px] mx-auto my-8 px-8'>
                <div className='flex flex-col'>
                    <h2 className='font-pyeojin text-4xl font-extrabold mb-2'>Nothing to see here — yet</h2>
                    <p className='text-gray-500 mb-7'>From likes to reposts and a whole lot more, this is where all the action happens.</p>
                </div>
            </div> */}
        </div>
    );
}
