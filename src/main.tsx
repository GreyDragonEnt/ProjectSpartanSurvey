import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './hooks/useToast.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { TemplateProvider } from './context/TemplateContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <ThemeProvider>
        <TemplateProvider>
          <App />
        </TemplateProvider>
      </ThemeProvider>
    </ToastProvider>
  </StrictMode>
);