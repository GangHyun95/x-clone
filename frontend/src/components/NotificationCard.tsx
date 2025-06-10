import Avatar from '@/components/Avatar';
import { HeartSvg, UserSvg } from '@/components/svgs';

type Props = {
    type: 'likes' | 'follows';
    user: {
        name: string;
        profile_img: string;
    };
    message: string;
    content?: string;
    created_at?: string;
};

export default function NotificationCard({ type, user, message, content, created_at }: Props) {
    const iconMap = {
        likes: <HeartSvg filled className='size-8 fill-red-500' />,
        follows: <UserSvg filled className='size-8 fill-primary' />,
    };

    return (
        <article className='border-b border-base-300 px-4 py-3 hover:bg-base-300 cursor-pointer'>
            <div className='flex'>
                <div className='mr-2'>{iconMap[type]}</div>
                <div className='flex flex-col grow pr-5'>
                    <Avatar nickname='테스트' src={user.profile_img} className='mb-3' />
                    <p>{message}</p>

                    {type === 'likes' && content && (
                        <span className='mt-3 text-gray-500'>{content}</span>
                    )}

                    {type === 'follows' && created_at && (
                        <span className='mt-3 text-gray-500'>{created_at}</span>
                    )}
                </div>
            </div>
        </article>
    );
}
