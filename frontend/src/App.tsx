import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';
import { Route, Routes, useLocation } from 'react-router-dom';

import LoginModal from '@/components/modals/LoginModal';
import ResetPasswordModal from '@/components/modals/ResetPasswordModal';
import SignUpModal from '@/components/modals/SignUpModal';
import useCheckAuth from '@/hooks/auth/useCheckAuth';
import AppLayout from '@/layouts/AppLayout';
import AuthLanding from '@/pages/home/AuthLanding';
import HomeScreen from '@/pages/home/HomeScreen';
import { useAppSelector } from '@/store/hooks';

function App() {
    const location = useLocation();
    const state = location.state;

    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const { checkAuth, isCheckingAuth } = useCheckAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !accessToken)
        return (
            <div className='flex items-center justify-center h-screen'>
                <CgSpinner className='size-10 animate-spin text-primary' />
            </div>
        );
    return (
        <>
            <Routes location={state?.backgroundLocation || location}>
                <Route path='/' element={<AppLayout />}>
                    <Route
                        index
                        element={accessToken ? <HomeScreen /> : <AuthLanding />}
                    />
                    <Route path='signup' element={null} />
                    <Route path='login' element={null} />
                </Route>
            </Routes>

            {location.pathname === '/signup' && <SignUpModal />}
            {location.pathname === '/login' && <LoginModal />}
            <Toaster />
        </>
    );
}

export default App;
