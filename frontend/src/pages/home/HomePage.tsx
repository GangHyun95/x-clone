import { useSearchParams } from 'react-router-dom';

import EmptyState from '@/components/common/EmptyState';
import { LoadMoreSpinner } from '@/components/common/Spinner';
import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { usePosts } from '@/queries/post';

export default function HomePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab') === 'following' ? 'following' : 'foryou';
    const { data = { pages: [], hasNextPage: false, nextCursor: null }, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage, } = usePosts(tab);
    const posts = data.pages.flatMap((page) => page.posts) ?? [];

    const lastPostRef = useInfiniteScroll({hasNextPage, isFetchingNextPage, fetchNextPage});

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
                {posts.map((post, idx) => {
                    const isLast = idx === posts.length - 1;
                    return (
                        <PostCard
                            key={post.id}
                            post={post}
                            ref={isLast ? lastPostRef : undefined}
                        />
                    );
                })}

                {hasNextPage && <LoadMoreSpinner />}
            </PageLayout.Content>
        </PageLayout>
    );
}
