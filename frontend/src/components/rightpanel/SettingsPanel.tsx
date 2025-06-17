// SettingsPanel.tsx
export default function SettingsPanel({ children }: { children: React.ReactNode }) {
    return (
        <div className='hidden lg:flex flex-col w-full max-w-[600px]'>
            <aside className='flex flex-col'>
                {children}
            </aside>
        </div>
    );
}
