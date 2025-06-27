import { useNavigate } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import FollowButton from '@/components/common/FollowButton';

type Props = {
    user: {
        id: number;
        username: string;
        full_name: string;
        profile_img: string;
        is_following: boolean;
        bio?: string
    };
};

export default function UserListItem({ user }: Props) {
    const navigate = useNavigate();
    return (
        <li
            className='px-4 py-3 leading-5 hover:bg-base-200 cursor-pointer'
            onClick={() => navigate(`/profile/${user.username}`)}>
            <article className='flex'>
                <Avatar username={user.username} src={user.profile_img} className='mr-2' />
                <div className='flex grow items-center justify-between min-w-0'>
                    <div className='flex flex-col w-full min-w-0'>
                        <h3 className='font-bold whitespace-nowrap truncate'>{user.full_name}</h3>
                        <span className='text-gray-500 whitespace-nowrap truncate'>@{user.username}</span>
                        {user.bio && <p className='text-sm mt-1 whitespace-nowrap truncate'>{user.bio}</p>}
                    </div>
                    <div className='ml-4' onClick={(e) => e.stopPropagation()}>
                        <FollowButton
                            id={user.id}
                            username={user.username}
                            is_following={user.is_following}
                        />
                    </div>
                </div>
            </article>
        </li>
    );
}
