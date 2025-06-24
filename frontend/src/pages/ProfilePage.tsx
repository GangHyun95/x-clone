import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import EmptyState from '@/components/common/EmptyState';
import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PageLayout from '@/components/layout/PageLayout';
import PostCard from '@/components/postcard';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { usePosts, useProfile } from '@/queries/user';
import { getCurrentUser } from '@/store/authStore';

export default function ProfilePage() {
    const { username = '' } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const tab = searchParams.get('tab') === 'like' ? 'like' : 'post';

    const me = getCurrentUser();
    const isMe = me?.username === username;

    const { data: user, isLoading: isUserLoading } = useProfile(username, {
        enabled: !isMe,
    });

    console.log(user);
    const current = isMe ? me : user;

    const { data: posts = [], isLoading: isPostLoading } = usePosts(username, tab);

    if (!current) {
        return (
            <div className='p-4 text-center text-gray-500'>
                존재하지 않는 사용자입니다.
            </div>
        );
    }

    const tabs = [
        { label: 'posts', active: tab === 'post', onClick: () => setSearchParams({ tab: 'post' }) },
        { label: 'likes', active: tab === 'like', onClick: () => setSearchParams({ tab: 'like' }) },
    ];
    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>
                    {isUserLoading ? (
                        'Profile'
                    ) : (
                        <div className='flex flex-col items-start font-medium'>
                            <h3 className='font-medium py-0.5 truncate whitespace-nowrap overflow-hidden w-full'>
                                {current.full_name}
                            </h3>
                            <span className='text-xs text-gray-500'>{current.post_count} post</span>
                        </div>
                    )}
                </StickyHeader.Header>
            </StickyHeader>
            <PageLayout.Content isLoading={isUserLoading} className='grow-0'>
                <ProfileHeader user={current} isMe={isMe}/>
            </PageLayout.Content>
            <PageLayout.Content isLoading={isPostLoading}>
                <section>
                    <Tabs tabs={tabs} />
                </section>
                <section>
                    {posts.length === 0 && (
                        <EmptyState
                            title={
                                tab === 'post'
                                    ? `${current.full_name} hasn’t posted anything yet.`
                                    : `${current.full_name} hasn’t liked any posts yet.`
                            }
                            description={
                                tab === 'post'
                                    ? `Posts from ${current.full_name} will appear here once they share something.`
                                    : `Posts that ${current.full_name} likes will show up here.`
                            }
                        />
                    )}
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </section>
            </PageLayout.Content>
        </PageLayout>
    );
}
