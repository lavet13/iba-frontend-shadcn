import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { ReactQueryProvider } from '@/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ReactQueryProvider>
        <ThemeProvider>
          <Toaster />
          <App />
        </ThemeProvider>
      </ReactQueryProvider>
    </BrowserRouter>
  </StrictMode>,
);
