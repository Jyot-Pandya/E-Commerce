import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';
import axios from 'axios';
import { ThemeProvider } from './components/ui/theme-provider';
import { ToastProvider } from './components/ui/toast';

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider defaultTheme="light" storageKey="ecommerce-theme">
        <ToastProvider>
          <App />
        </ToastProvider>
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
);
