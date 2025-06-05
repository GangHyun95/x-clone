export default function PageLayout({ children }: { children: React.ReactNode }) {
    return <div className='flex flex-col h-full'>{children}</div>;
}

PageLayout.Content = function Content({ children }: { children: React.ReactNode }) {
    return <div className='w-full max-w-[600px] grow'>{children}</div>;
}