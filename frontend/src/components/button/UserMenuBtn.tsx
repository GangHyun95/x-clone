import Avatar from '@/components/Avatar';
import { MoreSvg } from '@/components/svgs';
import { getCurrentUser } from '@/store/authStore';
import { getEmailUsername } from '@/utils/formatters';

export default function UserMenuBtn() {
    const me = getCurrentUser();
    return (
        <button className='btn btn-ghost btn-circle gap-0 w-max p-3 h-auto border-none xl:w-full'>
            <Avatar
                src={me.profile_img || '/avatar-placeholder.png'}
                overlay={false}
            />

            <div className='mx-3 hidden xl:flex flex-col flex-1 min-w-0 text-start'>
                <span className='truncate whitespace-nowrap font-semibold'>
                    {me.nickname}
                </span>
                <span className='truncate whitespace-nowrap text-gray-500 font-normal'>
                    {getEmailUsername(me.email)}
                </span>
            </div>

            <div className='hidden xl:flex flex-col'>
                <MoreSvg className='w-5 h-5 self-end' />
            </div>
        </button>
    );
}
