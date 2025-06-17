import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation } from 'react-router-dom';

import { LoginModal, ResetPasswordModal, SignUpModal } from '@/components/modals/auth';
import EditProfileModal from '@/components/modals/EditProfileModal';
import NewPostModal from '@/components/modals/NewPostModal';
import { SpinnerSvg } from '@/components/svgs';
import AppLayout from '@/layouts/AppLayout';
import { AuthLandingPage, BookmarkPage, HomePage, NotificationsPage, ProfilePage, SettingsPage } from '@/pages';
import { useCheckAuth, useMe } from '@/queries/auth';

function App() {
    const location = useLocation();
    const state = location.state;

    const { data: accessToken, isLoading: isAuthLoading } = useCheckAuth();
    const { data: user, isLoading: isMeLoading } = useMe({
        enabled: !!accessToken && !isAuthLoading
    });

    if ((isAuthLoading && !accessToken) || (isMeLoading && !user))
        return (
            <div className='flex items-center justify-center h-screen'>
                <SpinnerSvg className='size-10 animate-spin text-primary'/>
            </div>
        );
    return (
        <>
            <Routes location={state?.backgroundLocation || location}>
                <Route path='/' element={<AppLayout />}>
                    <Route
                        index
                        element={accessToken ? <HomePage /> : <AuthLandingPage />}
                    />
                    <Route path='notifications' element={<NotificationsPage />} />
                    <Route path='bookmarks' element={<BookmarkPage />} />
                    <Route path='settings/*' element={<SettingsPage />} />
                    <Route path='signup' element={null} />
                    <Route path='login' element={null} />
                    <Route path='reset-password' element={null} />
                    <Route path='profile/:nickname' element={<ProfilePage />} />
                </Route>
            </Routes>

            {location.pathname === '/signup' && <SignUpModal />}
            {location.pathname === '/login' && <LoginModal />}
            {location.pathname === '/reset-password' && <ResetPasswordModal />}
            {location.pathname === '/post/new' && <NewPostModal />}
            {location.pathname === '/settings/profile' && <EditProfileModal /> }
            <Toaster />
        </>
    );
}

export default App;
