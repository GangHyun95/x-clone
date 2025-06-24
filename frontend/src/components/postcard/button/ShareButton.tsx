import toast from 'react-hot-toast';

import { LinkSvg } from '@/components/svgs';

type Props = {
    id?: number;
};

export default function ShareButton({ id: postId }: Props) {
    const handleCopy = async () => {
        const url = postId ? `${window.location.origin}/post/${postId}` : window.location.href;

        try {
            await navigator.clipboard.writeText(url);
            toast.success('URL이 복사되었습니다.');
        } catch (err) {
            const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
            toast.error(`URL 복사 실패: ${message}`);
            console.error(err);
        }
    };

    return (
        <div className='flex items-center cursor-pointer group' onClick={handleCopy}>
            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                <LinkSvg className='h-5 fill-gray-500 group-hover:fill-primary' />
            </button>
        </div>
    );
}
