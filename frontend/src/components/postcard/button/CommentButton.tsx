import { CommentSvg } from '@/components/svgs';

export default function CommentButton({ id, commentCount}: { id: number, commentCount: number }) {
    console.log(id);
    return (
        <div className='flex-1 flex items-center cursor-pointer group'>
            <button className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                <CommentSvg className='h-5 fill-gray-500 group-hover:fill-primary' />
            </button>
            <span className='text-sm px-1'>{commentCount}</span>
        </div>
    );
}
