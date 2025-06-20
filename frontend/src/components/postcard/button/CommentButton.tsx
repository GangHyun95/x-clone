import { useLocation } from 'react-router-dom';

import ModalRouteBtn from '@/components/common/ModalRouteBtn';
import { CommentSvg } from '@/components/svgs';

export default function CommentButton({ id, commentCount}: { id: number, commentCount: number }) {
    const location = useLocation();
    return (
        <>
            <ModalRouteBtn 
                to={`/comment/new/${id}`}
                backgroundLocation={location.pathname}
                className='flex-1 flex items-center cursor-pointer group'
            >
                <span className='btn btn-sm btn-ghost btn-circle border-0 group-hover:bg-primary/10'>
                    <CommentSvg className='h-5 fill-gray-500 group-hover:fill-primary' />
                </span>
                <span className='text-sm px-1'>{commentCount}</span>
            </ModalRouteBtn>
        </>
    );
}
