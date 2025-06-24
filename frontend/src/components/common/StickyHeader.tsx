import { BackArrowSvg } from '@/components/svgs';

export default function StickyHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className='sticky top-0 z-10 bg-white/85 backdrop-blur-md'>
            {children}
        </div>
    );
}

StickyHeader.Header = function Header({ children, onPrev }: { children: React.ReactNode; onPrev?: () => void }) {
    return (
        <div className='flex items-center px-4 h-[53px]'>
            {onPrev && (
                <div className='min-w-[53px]'>
                    <button type='button' onClick={onPrev} className='btn btn-ghost btn-circle min-w-6 min-h-6 -m-2'>
                        <BackArrowSvg className='size-5' />
                    </button>
                </div>
            )}
            <h2 className='flex flex-col justify-center shrink-1 grow text-xl font-bold h-full min-w-0'>{children}</h2>
        </div>
    );
};

