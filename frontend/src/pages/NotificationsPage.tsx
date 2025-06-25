import { useSearchParams } from 'react-router-dom';

import EmptyState from '@/components/common/EmptyState';
import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PageLayout from '@/components/layout/PageLayout';
import NotificationCard from '@/components/NotificationCard';
import { useNotifications } from '@/queries/notification';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function NotificationsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const raw = searchParams.get('tab');
    const tab = raw === 'like' || raw === 'follow' ? raw : 'all';
    const { data = { pages: [], hasNextPage: false, nextCursor: null }, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useNotifications(tab);

    const notifications = data.pages.flatMap(page => page.notifications);
    const lastNotificationsRef = useInfiniteScroll({hasNextPage, isFetchingNextPage, fetchNextPage});

    const tabs = [
        { label: 'All', active: tab !== 'like' && tab !== 'follow', onClick: () => setSearchParams({ tab: 'all' }) },
        { label: 'Likes', active: tab === 'like', onClick: () => setSearchParams({ tab: 'like' }) },
        { label: 'Follows', active: tab === 'follow', onClick: () => setSearchParams({ tab: 'follow' }) },
    ];

    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header>Notifications</StickyHeader.Header>
                <Tabs tabs={tabs}/>
            </StickyHeader>

            <PageLayout.Content isLoading={isLoading}>
                {notifications.length === 0 && (
                    <EmptyState
                        title='Nothing to see here — yet'
                        description='From likes to follows, this is where all your notifications happen.'
                    />
                )}

                <section className='flex flex-col'>
                    {notifications.map((notification, idx) => {
                        const isLast = idx === notifications.length - 1;
                        return (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                ref={isLast ? lastNotificationsRef : undefined}
                            />
                        );
                    })}
                </section>
            </PageLayout.Content>
        </PageLayout>
    );
}
