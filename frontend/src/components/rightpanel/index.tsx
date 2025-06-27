import { useLocation } from 'react-router-dom';

import SuggestedUserList from '@/components/rightpanel/SuggestedUserList';

import { AccountPanel, ConfirmDeletePanel, DeletePanel, EditUsernamePanel, PasswordPanel } from './panels';

export default function RightPanel() {
    const { pathname } = useLocation();
    const isSettings = pathname.startsWith('/settings');

    if (!isSettings) {
        return (
            <div className='hidden lg:flex flex-col'>
                <aside className='sticky top-0 flex flex-col w-[290px] mr-[10px] lg-plus:w-[350px] xl-plus:mr-[70px]'>
                    <section className='flex flex-col pt-3'>
                        <div className='flex flex-col mb-4 rounded-2xl border border-base-300'>
                            <h2 className='px-4 py-3 text-xl font-extrabold'>Who to follow</h2>
                            <SuggestedUserList />
                        </div>
                    </section>
                </aside>
            </div>
        );
    }

    const panelMap: Record<string, React.ReactNode> = {
        'account': <AccountPanel />,
        'account/username': <EditUsernamePanel />,
        'password': <PasswordPanel />,
        'delete': <DeletePanel />,
        'delete/confirm': <ConfirmDeletePanel />
    };

    function isDesktop() {
        return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
    }
    
    const key = pathname.replace('/settings/', '');
    const content = panelMap[key] ?? null;
    if (!isDesktop()) return null;
    return (
        <div className='hidden lg:flex flex-col w-full max-w-[600px]'>
            <aside className='flex flex-col'>
                {content}
            </aside>
        </div>
    );
}
