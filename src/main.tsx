import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import App from '@/App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111827',
              color: '#F9FAFB',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              fontSize: '13px',
              borderRadius: '12px',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
