import { Outlet } from 'react-router-dom';

import BottomNav from '@/components/mobile/BottomNav';
import Sidebar from '@/components/sidebar';
import MainLayout from '@/layouts/MainLayout';
import { getAccessToken } from '@/store/authStore';
import CloneBanner from '@/components/auth/CloneBanner';

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
                <BottomNav />
            </div>
        );
    }

    return (
        <div className='flex flex-col h-screen'>
            <CloneBanner />
            <div className='flex flex-1 flex-col'>
                <main className='flex-auto flex flex-col'>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
