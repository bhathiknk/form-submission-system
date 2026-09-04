'use client';

import { Toaster } from 'react-hot-toast';

// centralizes toast styling so it matches the rest of the UI
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#0F172A',
          color: '#F8FAFC',
          fontSize: '14px',
          borderRadius: '10px',
        },
        success: { iconTheme: { primary: '#10B981', secondary: '#F8FAFC' } },
        error: { iconTheme: { primary: '#F43F5E', secondary: '#F8FAFC' } },
      }}
    />
  );
}
