import { useNavigate, useSearchParams } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import UserListItem from '@/components/common/UserListItem';
import PageLayout from '@/components/layout/PageLayout';
import { getCurrentUser } from '@/store/authStore';
import { useListByType } from '@/queries/user';
import EmptyState from '@/components/common/EmptyState';

const tabMeta = {
    suggest: {
        heading: 'Suggested for You',
        empty: {
            title: 'Be in the know',
            desc: 'Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.',
        },
    },
    follower: {
        heading: 'Your Followers',
        empty: {
            title: 'Looking for followers?',
            desc: 'When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.',
        },
    },
    following: {
        heading: 'Following Users',
        empty: {
            title: 'Be in the know',
            desc: 'Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.',
        },
    },
} as const;

export default function UsersTabPage() {
    const navigate = useNavigate();
    const me = getCurrentUser();
    const [searchParams, setSearchParams] = useSearchParams();

    const raw = searchParams.get('tab') ?? 'suggest';
    const tab = ['suggest', 'follower', 'following'].includes(raw)
        ? (raw as keyof typeof tabMeta)
        : 'suggest';

    const tabs = [
        { label: 'Suggested', active: tab === 'suggest', onClick: () => setSearchParams({ tab: 'suggest' }) },
        { label: 'Followers', active: tab === 'follower', onClick: () => setSearchParams({ tab: 'follower' }) },
        { label: 'Following', active: tab === 'following', onClick: () => setSearchParams({ tab: 'following' }) },
    ];

    const { data: users = [], isLoading } = useListByType(tab);

    console.log(users);

    const meta = tabMeta[tab];

    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>
                    <div className='flex flex-col items-start font-medium'>
                        <h3 className='font-medium py-0.5'>{me.full_name}</h3>
                        <span className='text-sm text-gray-500'>@{me.username}</span>
                    </div>
                </StickyHeader.Header>
                <div className='mb-2'>
                    <Tabs tabs={tabs} />
                </div>
            </StickyHeader>

            <h3 className='px-4 py-3 text-xl font-extrabold'>{meta.heading}</h3>

            <PageLayout.Content isLoading={isLoading}>
                {users.length === 0 && (
                    <EmptyState
                        title={meta.empty.title}
                        description={meta.empty.desc}
                    />
                )}
                <ul>
                    {users.map((user) => (
                        <UserListItem key={user.id} user={user} />
                    ))}
                </ul>
            </PageLayout.Content>
        </PageLayout>
    );
}
