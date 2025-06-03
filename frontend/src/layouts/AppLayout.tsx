import { Outlet } from 'react-router-dom';

import Footer from '@/components/commons/Footer';
import Sidebar from '@/components/commons/Sidebar';
import { useAppSelector } from '@/store/hooks';

export default function AppLayout() {
    const accessToken = useAppSelector((state) => state.auth.accessToken);
    return (
        <div className='flex flex-col h-screen'>
            <div className={`flex flex-1 ${accessToken ? 'flex-row' : 'flex-col'}`}>
                {accessToken && <Sidebar />}
                <main className='grow shrink'>
                    {accessToken ? <div className='w-[1050px] flex'><Outlet /></div> : <Outlet />}
                </main>
            </div>
            <Footer />
        </div>
    );
}
