import PostEditorForm from '@/components/editor/PostEditorForm';
import PageLayout from '@/components/layout/PageLayout';
import StickyHeader from '@/components/layout/StickyHeader';
import Tabs from '@/components/layout/Tabs';
import PostCard from '@/components/PostCard';

export default function HomePage() {

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
            <PostEditorForm profileImg='/temp.png'/>
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
