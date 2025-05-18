import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/auth/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

function App() {
    return (
        <div className='flex max-w-6xl mx-auto'>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' element={<SignUpPage />} />
            </Routes>
        </div>
    );
}

export default App;
