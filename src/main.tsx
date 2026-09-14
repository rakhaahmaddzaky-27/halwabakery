import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Handle benign Firebase Auth popup errors (popup closed by user, popup blocked in iframe, assertion race conditions)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = typeof reason === 'string' ? reason : reason?.message || '';
    const code = reason?.code || '';
    if (
      msg.includes('INTERNAL ASSERTION FAILED: Pending promise was never set') ||
      msg.includes('auth/popup-closed-by-user') ||
      msg.includes('auth/popup-blocked') ||
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/popup-blocked' ||
      code === 'auth/cancelled-popup-request'
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (
      msg.includes('INTERNAL ASSERTION FAILED: Pending promise was never set') ||
      msg.includes('auth/popup-closed-by-user') ||
      msg.includes('auth/popup-blocked')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
