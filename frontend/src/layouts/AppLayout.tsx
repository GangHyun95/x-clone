import Footer from '@/components/commons/Footer';
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
    return (
        <div className='flex flex-col h-screen'>
            <main className='flex-1'>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

