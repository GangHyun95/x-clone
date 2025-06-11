import { useSearchParams } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { usePosts } from '@/queries/post';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') === 'following' ? 'following' : 'foryou';
    const { data: posts } = usePosts(tab);

    const tabs = [
        { label: 'For you', active: tab === 'foryou', onClick: () => setSearchParams({ tab: 'foryou' }) },
        { label: 'Following', active: tab === 'following', onClick: () => setSearchParams({ tab: 'following' }) },
    ];

    if (!posts) return null;

    return (
        <PageLayout>
            <StickyHeader>
                <Tabs tabs={tabs} />
            </StickyHeader>
            <PostEditorForm />
            <PageLayout.Content>
                {posts.length === 0 && (
                    <section className='max-w-[400px] mx-auto my-8 px-8'>
                        <header className='flex flex-col'>
                            <h2 className='text-4xl font-extrabold mb-2'>
                                {tab === 'following' ? 'No posts from users you follow.' : 'No posts to show right now.'}
                            </h2>
                            <p className='text-gray-500 mb-7'>
                                {tab === 'following' ? 'Follow some users to see their posts here.' : 'Check back later for new posts.'}
                            </p>
                        </header>
                    </section>
                )}

                {posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                ))}
            </PageLayout.Content>
        </PageLayout>
    );
}
