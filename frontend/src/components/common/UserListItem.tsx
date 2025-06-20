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
    return (
        <li className='px-4 py-3 leading-5'>
            <article className='flex'>
                <Avatar username={user.username} src={user.profile_img} className='mr-2' />
                <div className='flex grow items-center justify-between'>
                    <div className='flex flex-col w-full'>
                        <h3 className='font-bold'>{user.full_name}</h3>
                        <span className='text-gray-500'>@{user.username}</span>
                        {user.bio && <p className='text-sm mt-1 line-clamp-2'>{user.bio}</p>}
                    </div>
                    <div className='ml-4'>
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
