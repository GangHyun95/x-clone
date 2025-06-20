import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/sidebar';
import MainLayout from '@/layouts/MainLayout';
import { getAccessToken } from '@/store/authStore';

export default function AppLayout() {
    const accessToken = getAccessToken();

    if (accessToken) {
        return (
            <div className='flex flex-col h-screen'>
                <div className='flex flex-1'>
                    <Sidebar />
                    <MainLayout>
                        <Outlet />
                    </MainLayout>
                </div>
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen'>
            <div className='flex flex-1 flex-col'>
                <main className='flex-auto flex flex-col'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
