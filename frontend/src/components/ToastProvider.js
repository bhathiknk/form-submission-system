'use client';

import { Toaster } from 'react-hot-toast';
import { palette } from '../theme/palette';

// centralizes toast styling so it matches the rest of the UI
export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: palette.ink,
          color: '#F5F6FB',
          fontSize: '14px',
          borderRadius: '10px',
          boxShadow: '0 12px 32px -8px rgba(20,22,31,0.45)',
        },
        success: { iconTheme: { primary: palette.teal, secondary: '#F5F6FB' } },
        error: { iconTheme: { primary: palette.coral, secondary: '#F5F6FB' } },
      }}
    />
  );
}
