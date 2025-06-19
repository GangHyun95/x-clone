import { Link, useParams } from 'react-router-dom';

import { ListSpinner } from '@/components/common/Spinner';
import UserListItem from '@/components/common/UserListItem';
import { useSuggested } from '@/queries/user';
import { getCurrentUser } from '@/store/authStore';


export default function SuggestedUserList() {
    const { username } = useParams<{ username: string }>();
    const me = getCurrentUser();
    const currentUsername = me.username !== username ? username : undefined;

    const { data: suggestedUsers = [], isLoading } = useSuggested(currentUsername);

    if (isLoading) return <ListSpinner />

    return (
        <>
            <ul className='flex flex-col'>
                {suggestedUsers.map((user) => (
                    <UserListItem key={user.id} user={user} />
                ))}
            </ul>
            <Link to='/users' className='bn btn-ghost justify-start rounded-t-none border-0 p-4 text-left text-primary'>
                Show more
            </Link>
        </>
    );
}

