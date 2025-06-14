import { useParams } from 'react-router-dom';

import Avatar from '@/components/common/Avatar';
import FollowButton from '@/components/common/FollowButton';

import { SpinnerSvg } from '@/components/svgs';
import { useSuggestedUsers } from '@/queries/user';


export default function SuggestedUserList() {
    const { nickname } = useParams();
    const { data: suggestedUsers = [], isLoading } = useSuggestedUsers(nickname);
    if (isLoading) return (
        <div className='w-full flex grow items-center justify-center min-h-[300px]'>
            <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
        </div>
    )

    return (
        <>
            <ul className='flex flex-col'>
                {suggestedUsers.map((user) => (
                    <li key={user.id} className='px-4 py-3 leading-5'>
                        <article className='flex'>
                            <Avatar nickname={user.nickname} src={user.profile_img} className='mr-2' />
                            <div className='flex grow items-center justify-between'>
                                <div className='flex flex-col w-full'>
                                    <h3 className='font-bold'>{user.full_name}</h3>
                                    <span className='text-gray-500'>@{user.nickname}</span>
                                </div>
                                <div className='ml-4'>
                                    <FollowButton id={user.id} nickname={user.nickname} is_following={user.is_following}/>
                                </div>
                            </div>
                        </article>
                    </li>
                ))}
            </ul>
            <button className='bn btn-ghost justify-start rounded-t-none border-0 p-4 text-left text-primary'>
                Show more
            </button>
        </>
    );
}

