import { Link } from 'react-router-dom';

import { BackArrowSvg } from '@/components/svgs';

export default function StickyHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className='sticky top-0 z-10 border-b border-base-300 bg-white/85 backdrop-blur-md'>
            {children}
        </div>
    );
}

StickyHeader.Header = function Header({ children, onPrev }: { children: React.ReactNode; onPrev?: () => void }) {
    return (
        <div className='flex items-center px-4 h-[53px]'>
            {onPrev && (
                <div className='min-w-[53px]'>
                    <button onClick={onPrev} className='btn btn-ghost btn-circle min-w-6 min-h-6 -m-2'>
                        <BackArrowSvg className='size-5' />
                    </button>
                </div>
            )}
            <h2 className='flex flex-col justify-center shrink-1 grow text-xl font-bold h-full'>{children}</h2>
        </div>
    );
};

StickyHeader.Tabs = function Tabs({ tabs }: { tabs: { label: string; to: string; active: boolean }[] }) {
    return (
        <div className='flex'>
            {tabs.map((tab) => (
                <div key={tab.label} className='flex grow flex-col items-center justify-center'>
                    <Link
                        to={tab.to}
                        className={`relative h-auto w-full grow bn btn-ghost rounded-none border-0 px-4 ${
                            tab.active ? 'font-bold' : 'font-medium text-gray-500'
                        }`}
                    >
                        <span className='py-4'>{tab.label}</span>
                        {tab.active && (
                            <span className='absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-primary' />
                        )}
                    </Link>
                </div>
            ))}
        </div>
    );
};
