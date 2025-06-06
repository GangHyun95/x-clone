import { CloseSvg, XSvg } from '@/components/svgs';
import RouteModal from '@/layouts/RouteModal';

export default function AuthModalLayout({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <RouteModal>
            <div
                className={`modal-box flex flex-col w-full h-full max-w-none p-0 rounded-none 
                        md:min-w-[600px] md:h-[650px] md:min-h-[400px] md:max-h-[90vh] md:rounded-2xl md:max-w-[600px] ${className}`}
            >
                <header className='flex h-14 justify-center px-4'>
                    <form method='dialog' className='flex flex-1 basis-1/2 items-center'>
                        <button className='btn btn-ghost btn-circle border-0 font-normal'>
                            <CloseSvg className='w-5'/>
                        </button>
                    </form>
                    <div className='flex flex-auto min-w-8 items-center'>
                        <XSvg />
                    </div>
                    <div className='flex-1 basis-1/2 min-h-8' />
                </header>

                <section className='flex-1 flex flex-col overflow-hidden'>
                    {children}
                </section>
            </div>
        </RouteModal>
    );
}
