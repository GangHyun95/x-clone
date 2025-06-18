import { useLocation, useNavigate } from 'react-router-dom';

import StickyHeader from '@/components/common/StickyHeader';
import PageLayout from '@/components/layout/PageLayout';
import { AccountPanel, DeletePanel, EditUsernamePanel, PasswordPanel } from '@/components/rightpanel/panels';
import { AlertSvg, KeySvg, RightArrowSvg, UserSvg } from '@/components/svgs';

function isDesktop() {
    return typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
}

export default function SettingsPage() {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const key = pathname.replace('/settings/', '');

    const panelMap: Record<string, React.ReactNode> = {
        'account': <AccountPanel />,
        'password': <PasswordPanel />,
        'delete': <DeletePanel />,
        'account/username': <EditUsernamePanel />,
    };

    const content = panelMap[key];
    const isPanelOpen = pathname !== '/settings';

    const handleNavigate = (path: string) => {
        navigate(path, { replace: isPanelOpen });
    };

    if (!isDesktop() && content) {
        return content;
    }

    return (
        <PageLayout>
            <StickyHeader>
                <StickyHeader.Header>Settings</StickyHeader.Header>
            </StickyHeader>

            <PageLayout.Content>
                <div className='flex flex-col'>
                    <div
                        onClick={() => handleNavigate('/settings/account')}
                        className='flex items-center px-4 py-3 hover:bg-base-200 cursor-pointer'
                    >
                        <div className='w-12 h-12 flex justify-center items-center mr-4'><UserSvg className='h-5' /></div>
                        <div className='flex-auto flex flex-col'>
                            <h3>Account information</h3>
                            <p className='text-sm text-gray-400'>See your account info like your email.</p>
                        </div>
                        <RightArrowSvg className='h-5 fill-gray-500' />
                    </div>

                    <div
                        onClick={() => handleNavigate('/settings/password')}
                        className='flex items-center px-4 py-3 hover:bg-base-200 cursor-pointer'
                    >
                        <div className='w-12 h-12 flex justify-center items-center mr-4'><KeySvg className='h-5' /></div>
                        <div className='flex-auto flex flex-col'>
                            <h3>Change your password</h3>
                            <p className='text-sm text-gray-400'>Change at any time.</p>
                        </div>
                        <RightArrowSvg className='h-5 fill-gray-500' />
                    </div>

                    <div className='mt-6 border-t border-gray-200'>
                        <h4 className='text-sm font-semibold text-red-500 mb-2 px-4 pt-4'>Danger zone</h4>

                        <div
                            onClick={() => handleNavigate('/settings/delete')}
                            className='flex items-center px-4 py-3 text-red-500 hover:bg-red-100 cursor-pointer'
                        >
                            <div className='w-12 h-12 flex justify-center items-center mr-4'><AlertSvg className='h-5' /></div>
                            <div className='flex-auto flex flex-col'>
                                <h3>Delete Account</h3>
                                <p className='text-sm text-red-400'>Permanently delete your account and data.</p>
                            </div>
                            <RightArrowSvg className='h-5 fill-red-400' />
                        </div>
                    </div>
                </div>
            </PageLayout.Content>
        </PageLayout>
    );
}
