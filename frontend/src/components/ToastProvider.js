'use client';

import { Toaster } from 'react-hot-toast';

// centralizes toast styling so it matches the rest of the UI
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#161A20',
          color: '#F7F5F1',
          fontSize: '14px',
          borderRadius: '6px',
        },
        success: { iconTheme: { primary: '#3E5C4A', secondary: '#F7F5F1' } },
        error: { iconTheme: { primary: '#A8442E', secondary: '#F7F5F1' } },
      }}
    />
  );
}
