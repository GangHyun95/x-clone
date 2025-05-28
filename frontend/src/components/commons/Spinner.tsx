import { CgSpinner } from 'react-icons/cg';

export default function Spinner() {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 flex items-center justify-center mb-12'>
                <CgSpinner className='size-10 md:size-8 animate-spin text-primary' />
            </div>
        </div>
    );
}
