import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import EmptyState from '@/components/common/EmptyState';
import StickyHeader from '@/components/common/StickyHeader';
import Tabs from '@/components/common/Tabs';
import UserListItem from '@/components/common/UserListItem';
import PageLayout from '@/components/layout/PageLayout';
import { useListByType } from '@/queries/user';
import { getCurrentUser } from '@/store/authStore';

const tabMeta = {
    suggest: {
        getHeading: () => 'Suggested for You',
        getEmpty: () => ({
            title: 'Be in the know',
            desc: 'Following accounts is an easy way to curate your timeline and know what’s happening with the topics and people you’re interested in.',
        }),
    },
    follower: {
        getHeading: (name: string) => `${name}'s Followers`,
        getEmpty: (name: string) => ({
            title: `Looking for ${name}'s followers?`,
            desc: 'When someone follows this account, they’ll show up here. Posting and interacting with others helps boost followers.',
        }),
    },
    following: {
        getHeading: (name: string) => `${name} is Following`,
        getEmpty: (name: string) => ({
            title: `${name} isn't following anyone yet`,
            desc: 'Following accounts is an easy way to curate a timeline and discover more content.',
        }),
    },
} as const;

export default function UsersTabPage() {
    const navigate = useNavigate();
    const { username = '' } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const me = getCurrentUser();

    const raw = searchParams.get('tab') ?? 'suggest';
    const tab = ['suggest', 'follower', 'following'].includes(raw)
        ? (raw as keyof typeof tabMeta)
        : 'suggest';

    const displayName = tab === 'suggest' ? '' : username;
    const queryUsername = tab === 'suggest' ? me.username : username;

    const tabs = [
        { label: 'Suggested', active: tab === 'suggest', onClick: () => setSearchParams({ tab: 'suggest' }) },
        { label: 'Followers', active: tab === 'follower', onClick: () => setSearchParams({ tab: 'follower' }) },
        { label: 'Following', active: tab === 'following', onClick: () => setSearchParams({ tab: 'following' }) },
    ];

    const { data: users, isLoading, isError } = useListByType(tab, queryUsername);
    const meta = tabMeta[tab];

    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header onPrev={() => navigate(-1)}>Connect</StickyHeader.Header>
                <div className='mb-2'>
                    <Tabs tabs={tabs} />
                </div>
            </StickyHeader>
            
            {(tab === 'suggest' || !isError) && (
                <h3 className='px-4 py-3 text-xl font-extrabold'>
                    {meta.getHeading(displayName)}
                </h3>
            )}

            <PageLayout.Content isLoading={isLoading}>
                {isError && (
                    <EmptyState
                        title='존재하지 않는 사용자입니다.'
                        description='입력한 사용자를 찾을 수 없습니다. 사용자 이름을 다시 확인해 주세요.'
                    />
                )}
                {users?.length === 0 && (
                    <EmptyState
                        title={meta.getEmpty(displayName).title}
                        description={meta.getEmpty(displayName).desc}
                    />
                )}
                <ul>
                    {users?.map((user) => (
                        <UserListItem key={user.id} user={user} />
                    ))}
                </ul>
            </PageLayout.Content>
        </PageLayout>
    );
}
