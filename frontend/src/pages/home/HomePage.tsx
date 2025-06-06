import { useState } from 'react';

import Avatar from '@/components/Avatar';
import SingleLineEditor from '@/components/editor/SingleLineEditor';
import PageLayout from '@/components/layout/PageLayout';
import StickyHeader from '@/components/layout/StickyHeader';
import Tabs from '@/components/layout/Tabs';
import PostCard from '@/components/PostCard';
import { EmojiSvg, MediaSvg} from '@/components/svgs';

export default function HomePage() {
    const [isDisabled, setIsDisabled] = useState(true);

    const tabs = [
        { label: 'For you', to: '/', active: true },
        { label: 'Following', to: '/', active: false },
    ];
    
    const user = {
        profile_img: '/temp.png',
        name: '테스트계정',
        nickname: 'test',
    };

    return (
        <PageLayout>
            <StickyHeader>
                <Tabs tabs={tabs}/>
            </StickyHeader>

            <form className='flex px-4 border-b border-base-300'>
                <div className='mr-2 pt-3'>
                    <Avatar src='/temp.png' />
                </div>
                <div className='flex grow flex-col pt-1'>
                    <SingleLineEditor
                        onTextChange={(text) => setIsDisabled(text.trim().length === 0)}
                    />
                    <footer className='flex items-center justify-between pb-2'>
                        <div className='mt-2 grow'>
                            <button
                                type='button'
                                className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                            >
                                <MediaSvg className='w-5 fill-primary' />
                            </button>
                            <button
                                type='button'
                                className='btn btn-sm btn-ghost btn-circle hover:bg-primary/10 border-0'
                            >
                                <EmojiSvg className='w-5 fill-primary' />
                            </button>
                        </div>
                        <div className='ml-4 mt-2'>
                            <button
                                type='submit'
                                className='btn btn-secondary btn-circle w-auto h-auto min-h-[36px] px-4'
                                disabled={isDisabled}
                            >
                                Post
                            </button>
                        </div>
                    </footer>
                </div>
            </form>
            <PageLayout.Content>
                <PostCard 
                    user={user}
                    content='자녀분이 선물을 받고 기뻐하시겠어요.'
                    image='/test.jpeg'
                    created_at='2025-06-04T12:30:00.000Z'
                    counts={{ comment: 3, like: 523 }}
                />
            </PageLayout.Content>
        </PageLayout>
    );
}
