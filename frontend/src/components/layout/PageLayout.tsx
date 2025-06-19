import { SectionSpinner } from '@/components/common/Spinner';

export default function PageLayout({ children }: { children: React.ReactNode }) {
    return <div className='flex flex-col h-full'>{children}</div>;
}

PageLayout.Content = function Content({ children, isLoading, className }: { children: React.ReactNode, isLoading?: boolean, className?: string }) {
    if (isLoading) return <SectionSpinner />;
    return (
        <section className={`w-full max-w-[600px] grow ${className ? className : ''}`}>
            {children}
        </section>
    )
}