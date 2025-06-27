import { Toaster } from 'react-hot-toast';
import { Route, Routes, useLocation, useMatch } from 'react-router-dom';

import ScrollToTop from '@/components/common/ScrollToTop';
import { FullPageSpinner } from '@/components/common/Spinner';
import { LoginModal, ResetPasswordModal, SignUpModal } from '@/components/modals/auth';
import EditProfileModal from '@/components/modals/EditProfileModal';
import NewCommentModal from '@/components/modals/NewCommentModal';
import NewPostModal from '@/components/modals/NewPostModal';
import AppLayout from '@/layouts/AppLayout';
import { AuthLandingPage, BookmarkPage, HomePage, NotificationsPage, PostDetailPage, ProfilePage, SettingsPage, UsersTabPage } from '@/pages';
import { useCheckAuth, useMe } from '@/queries/auth';
import ProtectedRoute from '@/routes/ProtectedRoute';

function App() {
    const location = useLocation();
    const state = location.state;
    const commentMatch = useMatch('/comment/new/:id');

    const { data: accessToken, isLoading: isAuthLoading } = useCheckAuth();
    const { data: user, isLoading: isMeLoading } = useMe({
        enabled: !!accessToken && !isAuthLoading
    });

    if ((isAuthLoading && !accessToken) || (isMeLoading && !user)) return <FullPageSpinner />;
    return (
        <>
            <ScrollToTop />
            <Routes location={state?.backgroundLocation || location}>
                <Route path='/' element={<AppLayout />}>
                    <Route
                        index
                        element={accessToken ? <HomePage /> : <AuthLandingPage />}
                    />
                    <Route element={<ProtectedRoute isAllowed={!!accessToken} />}>
                        <Route path='notifications' element={<NotificationsPage />} />
                        <Route path='bookmarks' element={<BookmarkPage />} />
                        <Route path='settings/*' element={<SettingsPage />} />
                        <Route path='post/:postId' element={<PostDetailPage />} />
                        <Route path='users/:username' element={<UsersTabPage />} />
                        <Route path='profile/:username' element={<ProfilePage />} />
                    </Route>
                </Route>
            </Routes>
            
            {!accessToken && (
                <>
                    {location.pathname === '/signup' && <SignUpModal />}
                    {location.pathname === '/login' && <LoginModal />}
                    {location.pathname === '/reset-password' && <ResetPasswordModal />}
                </>
            )}
            {accessToken && (
                <>
                    {location.pathname === '/post/new' && <NewPostModal />}
                    {location.pathname === '/settings/profile' && <EditProfileModal />}
                    {commentMatch && <NewCommentModal />}
                </>
            )}
            <Toaster />
        </>
    );
}

export default App;
