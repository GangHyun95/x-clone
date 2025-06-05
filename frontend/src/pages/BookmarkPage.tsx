import { useNavigate } from 'react-router-dom';

import PageLayout from '@/components/layout/PageLayout';
import StickyHeader from '@/components/layout/StickyHeader';
import PostCard from '@/components/PostCard';
import { BookmarkSvg, CommentSvg, HeartSvg, SearchSvg, ShareSvg } from '@/components/svgs';

export default function BookmarkPage() {
    const navigate = useNavigate();

    const user = {
        profile_img: '/temp.png',
        name: '테스트계정',
        nickname: 'test',
    }
    const postActions = [
        { icon: CommentSvg, count: 3 },
        { icon: HeartSvg, count: 523, color: 'red-500' },
        { icon: BookmarkSvg },
        { icon: ShareSvg },
    ];
    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>Bookmarks</StickyHeader.Header>
            </StickyHeader>
            
            <PageLayout.Content>
                <div className='flex flex-col items-center my-2'>
                    <div className='w-[95%] min-h-10'>
                        <div className='border border-gray-300 rounded-full focus-within:border-primary'>
                            <div className='flex items-center border border-transparent rounded-full focus-within:border-primary'>
                                <div>
                                    <SearchSvg className='size-4 pl-3 shrink-0 box-content z-10'/>
                                </div>
                                <input type='text' className='text-sm min-h-10 grow outline-0 pl-1 pr-4 placeholder:text-gray-500 text-gray-500 peer' placeholder='Search Bookmarks' />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='max-w-[400px] mx-auto my-8 px-8'>
                    <div className='flex flex-col'>
                        <h2 className='font-pyeojin text-4xl font-extrabold mb-2'>Save posts for later</h2>
                        <p className='text-gray-500 mb-7'>Bookmark posts to easily find them again in the future.</p>
                    </div>
                </div> */}

                <PostCard
                    user={user}
                    content='자녀분이 선물을 받고 기뻐하시겠어요.'
                    image='/test.jpeg'
                    created_at='2025-06-04T12:30:00.000Z'
                    actions={postActions}
                />
            </PageLayout.Content>
        </PageLayout>
    );
}

