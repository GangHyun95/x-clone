import { useSearchParams } from 'react-router-dom';

import EmptyState from '@/components/common/EmptyState';
import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { usePosts } from '@/queries/post';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') === 'following' ? 'following' : 'foryou';
    const { data: posts = [], isLoading } = usePosts(tab);

    const tabs = [
        { label: 'For you', active: tab === 'foryou', onClick: () => setSearchParams({ tab: 'foryou' }) },
        { label: 'Following', active: tab === 'following', onClick: () => setSearchParams({ tab: 'following' }) },
    ];

    return (
        <PageLayout>
            <StickyHeader>
                <Tabs tabs={tabs} />
            </StickyHeader>
            <PostEditorForm />
            <PageLayout.Content isLoading={isLoading}>
                {posts.length === 0 && (
                    <EmptyState
                        title={
                            tab === 'following'
                                ? 'No posts from users you follow.'
                                : 'No posts to show right now.'
                        }
                        description={
                            tab === 'following'
                                ? 'Follow some users to see their posts here.'
                                : 'Check back later for new posts.'
                        }
                    />
                )}

                {posts.map((post) => (
                    <PostCard key={post.id} {...post} />
                ))}
            </PageLayout.Content>
        </PageLayout>
    );
}
