import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { usePosts } from '@/queries/post';

export default function HomePage() {
    const { data: posts } = usePosts();
    const tabs = [
        { label: 'For you', to: '/', active: true },
        { label: 'Following', to: '/', active: false },
    ];

    return (
        <PageLayout>
            <StickyHeader>
                <Tabs tabs={tabs}/>
            </StickyHeader>
            <PostEditorForm />
            <PageLayout.Content>
                {posts?.map((post) => (
                    <PostCard key={post.id} {...post}/>
                ))}
            </PageLayout.Content>
        </PageLayout>
    );
}
