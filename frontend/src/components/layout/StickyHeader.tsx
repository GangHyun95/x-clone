export default function StickyHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className='sticky top-0 z-10 border-b border-base-300 bg-white/85 backdrop-blur-md'>
            {children}
        </div>
    );
}

