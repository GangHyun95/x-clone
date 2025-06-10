import { useNavigate } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { SearchSvg} from '@/components/svgs';

export default function BookmarkPage() {
    const navigate = useNavigate();

    const user = {
        profile_img: '/temp.png',
        name: '테스트계정',
        nickname: 'test',
    }
    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>Bookmarks</StickyHeader.Header>
            </StickyHeader>

            <PageLayout.Content>
                <section className='flex flex-col items-center my-2'>
                    <div className='w-[95%] min-h-10'>
                        <div className='border border-gray-300 rounded-full focus-within:border-primary'>
                            <div className='flex items-center border border-transparent rounded-full focus-within:border-primary'>
                                <div>
                                    <SearchSvg className='size-4 pl-3 shrink-0 box-content z-10' />
                                </div>
                                <input
                                    type='text'
                                    className='text-sm min-h-10 grow outline-0 pl-1 pr-4 placeholder:text-gray-500 text-gray-500 peer'
                                    placeholder='Search Bookmarks'
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/*
                <section className='max-w-[400px] mx-auto my-8 px-8'>
                    <header className='flex flex-col'>
                        <h2 className='text-4xl font-extrabold mb-2'>Save posts for later</h2>
                        <p className='text-gray-500 mb-7'>Bookmark posts to easily find them again in the future.</p>
                    </header>
                </section>
                */}
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

