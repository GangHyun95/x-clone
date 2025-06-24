import RightPanel from '@/components/rightpanel';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='min-w-0 w-full flex-auto flex flex-col md:w-auto'>
            <div className='w-full md:w-[660px] lg:w-[920px] lg-plus:w-[990px] xl-plus:w-[1050px] flex flex-col grow'>
                <div className='flex grow justify-between text-[15px]'>
                    <section className='grow w-full max-w-[600px] border-x border-base-300'>
                        {children}
                    </section>
                    <RightPanel />
                </div>
            </div>
        </main>
    );
}

