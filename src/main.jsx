import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';
import axios from 'axios';
import { ThemeProvider } from './components/ui/theme-provider';
import { ToastProvider } from './components/ui/toast';

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5000';

// Add error logging
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Force light theme by default to avoid blank screen
document.documentElement.classList.remove('dark');
document.documentElement.classList.add('light');

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
