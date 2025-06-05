import { SpinnerSvg } from '@/components/svgs';

export default function Spinner() {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 flex items-center justify-center mb-12'>
                <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
            </div>
        </div>
    );
}
