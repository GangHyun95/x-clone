import { Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/home/HomePage';
import AppLayout from './layouts/AppLayout';
import SignUpModal from './components/auth/SignUpModal';
import LoginModal from './components/auth/LoginModal';

function App() {
    const location = useLocation();
    const state = location.state;
    console.log(location);
    return (
        <>
            <Routes location={state?.backgroundLocation || location}>
                <Route path='/' element={<AppLayout />}>
                    <Route index element={<HomePage />} />
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
