import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import PageLayout from '@/components/layout/PageLayout';
import NotificationCard from '@/components/NotificationCard';

export default function NotificationsPage() {
    const tabs = [
        { label: 'All', to: '/notifications', active: true },
        { label: 'Likes', to: '/notifications', active: false },
        { label: 'Follows', to: '/notifications', active: false },
    ];
    
    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header>Notifications</StickyHeader.Header>
                <Tabs tabs={tabs}/>
            </StickyHeader>

            <PageLayout.Content>
                <section className='flex flex-col'>
                    <NotificationCard
                        type='likes'
                        user={{ name: 'ㅇㅅㅇ', profile_img: '/temp.png' }}
                        message='ㅇㅅㅇ liked your posts.'
                        content='Lorem ipsum dolor sit amet consectetur adipisicing elit. Non reprehenderit architecto hic atque distinctio obcaecati totam aliquam deleniti adipisci, perferendis quidem molestiae rerum voluptatem doloremque error veniam? Aliquid, expedita totam.'
                    />
                    <NotificationCard
                        type='follows'
                        user={{ name: 'ㅇㅅㅇ', profile_img: '/temp.png' }}
                        message='ㅇㅅㅇ started following you.'
                        created_at='May 23, 2025'
                    />
                </section>
            </PageLayout.Content>
            {/* <section className='max-w-[400px] mx-auto my-8 px-8'>
                <header className='flex flex-col'>
                    <h2 className='text-4xl font-extrabold mb-2'>Nothing to see here — yet</h2>
                    <p className='text-gray-500 mb-7'>
                        From likes to reposts and a whole lot more, this is where all the action happens.
                    </p>
                </header>
            </section> 
            */}
        </PageLayout>
    );
}
