import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/Sidebar';
import MainLayout from '@/layouts/MainLayout';
import { useAppSelector } from '@/store/hooks';

export default function AppLayout() {
    const accessToken = useAppSelector((state) => state.auth.accessToken);

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
