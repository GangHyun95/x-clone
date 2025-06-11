import { useState } from 'react';

import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import { usePosts } from '@/queries/post';

export default function HomePage() {
    const { data: posts } = usePosts();
    const [openPostId, setOpenPostId] = useState<number | null>(null);
    const tabs = [
        { label: 'For you', to: '/', active: true },
        { label: 'Following', to: '/', active: false },
    ];

    return (
        <PageLayout>
            <StickyHeader>
                <Tabs tabs={tabs} />
            </StickyHeader>
            <PostEditorForm />
            <PageLayout.Content>
                {posts?.map((post) => (
                    <PostCard
                        key={post.id}
                        {...post}
                        openPostId={openPostId}
                        setOpenPostId={setOpenPostId}
                    />
                ))}
            </PageLayout.Content>
        </PageLayout>
    );
}
