import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/home/HomePage';
import AppLayout from './layouts/AppLayout';

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<AppLayout />}>
                    <Route index element={<HomePage />} />
                </Route>
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
