import RightPanel from '@/components/layout/RightPanel';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='flex-auto flex flex-col'>
            <div className='w-[660px] lg:w-[990px] xl:w-[1050px] flex flex-col grow'>
                <div className='flex grow justify-between text-[15px]'>
                    <div className='grow max-w-[600px] border-x border-base-300'>
                        {children}
                    </div>
                    <RightPanel />
                </div>
            </div>
        </main>
    );
}

