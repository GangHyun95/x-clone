import { useSearchParams } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PageLayout from '@/components/layout/PageLayout';
import NotificationCard from '@/components/NotificationCard';
import { useNotifications } from '@/queries/notification';

export default function NotificationsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const raw = searchParams.get('tab');
    const tab = raw === 'like' || raw === 'follow' ? raw : 'all';
    const { data: notifications = [], isLoading } = useNotifications(tab);

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
                    <section className='max-w-[400px] mx-auto my-8 px-8'>
                        <header className='flex flex-col'>
                            <h2 className='text-4xl font-extrabold mb-2'>
                                Nothing to see here — yet
                            </h2>
                            <p className='text-gray-500 mb-7'>
                                From likes to follows, this is where all your notifications happen.
                            </p>
                        </header>
                    </section>
                )}

                <section className='flex flex-col'>
                    {notifications.map(notification => (
                        <NotificationCard key={notification.id} {...notification} />
                    ))}
                </section>
            </PageLayout.Content>
        </PageLayout>
    );
}
