import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import StickyHeader from '@/components/layout/StickyHeader';
import Tabs from '@/components/layout/Tabs';
import PostCard from '@/components/PostCard';
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
                    <PostCard 
                        user={post.user}
                        key={post.id}
                        content={post.content}
                        image={post.img}
                        created_at={post.created_at}
                        counts={post.counts}

                    />
                ))}
            </PageLayout.Content>
        </PageLayout>
    );
}
