import { SpinnerSvg } from '@/components/svgs';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return <div className='flex flex-col h-full'>{children}</div>;
}

PageLayout.Content = function Content({ children, isLoading }: { children: React.ReactNode, isLoading?: boolean }) {
    if (isLoading) {
        return (
            <section className='w-full grow flex items-center justify-center'>
                <SpinnerSvg className='size-10 md:size-8 text-primary animate-spin' />
            </section>
        );
    }
    return <section className='w-full max-w-[600px] grow'>{children}</section>;
}