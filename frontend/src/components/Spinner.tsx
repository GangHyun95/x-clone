import { SpinnerSvg } from '@/components/svgs';

export default function Spinner() {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-white'>
            <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
        </div>
    );
}
