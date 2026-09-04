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
          color: '#F7F5F1',
          fontSize: '14px',
          borderRadius: '8px',
        },
        success: { iconTheme: { primary: palette.moss, secondary: '#F7F5F1' } },
        error: { iconTheme: { primary: palette.rust, secondary: '#F7F5F1' } },
      }}
    />
  );
}
