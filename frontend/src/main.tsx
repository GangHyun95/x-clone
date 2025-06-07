import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';

import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/queryClient';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </BrowserRouter>
    </StrictMode>
);
