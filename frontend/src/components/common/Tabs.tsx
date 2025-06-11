type Tab = {
    label: string;
    active: boolean;
    onClick: () => void;
}
type Props = {
    tabs: Tab[];
}
export default function Tabs({ tabs }: Props) {
    return (
        <nav className='flex border-b border-base-300'>
            {tabs.map((tab) => (
                <div key={tab.label} className='flex grow flex-col items-center justify-center'>
                    <button
                        onClick={tab.onClick}
                        className={`relative h-auto w-full grow bn btn-ghost rounded-none border-0 px-4 ${
                            tab.active ? 'font-bold' : 'font-medium text-gray-500'
                        }`}
                    >
                        <span className='py-4'>{tab.label}</span>
                        {tab.active && (
                            <span className='absolute bottom-0 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-primary' />
                        )}
                    </button>
                </div>
            ))}
        </nav>
    );
};