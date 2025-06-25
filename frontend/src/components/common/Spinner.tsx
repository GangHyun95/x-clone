import { SpinnerSvg } from '@/components/svgs';

export function FullPageSpinner() {
    return (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-white'>
            <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
        </div>
    );
}

export function InlineSpinner({ label='Saving', color }: { label?: string; color?: string; }) {
    return (
        <div className='flex items-center'>
            <SpinnerSvg className={`size-5 animate-spin ${color ? `text-${color}` : 'text-primary'}`} />
            <span className={`ml-1 ${color ? `text-${color}` : ''}`}>{label}...</span>
        </div>
    );
}

export  function AuthModalSpinner() {
    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 flex items-center justify-center mb-12'>
                <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
            </div>
        </div>
    );
}
export function SectionSpinner() {
    return (
        <section className='w-full grow flex items-center justify-center'>
            <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
        </section>
    );
}

export function ListSpinner() {
    return (
        <div className='w-full flex grow items-center justify-center min-h-[300px]'>
            <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
        </div>
    );
}

export function LoadMoreSpinner() {
    return (
        <div className='w-full py-6 flex items-center justify-center'>
            <SpinnerSvg className='size-6 text-primary animate-spin' />
        </div>
    );
}