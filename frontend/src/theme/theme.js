'use client';

import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

// Shared theme: both the public site and the admin area pull from this,
// admin pages just flip a few surface colors to dark via component props.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.brass, dark: palette.brassDark, contrastText: '#161A20' },
    secondary: { main: palette.moss, contrastText: '#FFFFFF' },
    error: { main: palette.rust },
    background: { default: palette.paper, paper: '#FFFFFF' },
    text: { primary: palette.ink, secondary: '#5B5F66' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
    h1: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h2: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h3: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600 },
    h4: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    // flat, document-like buttons instead of glossy default MUI shadows
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: 'none' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    // small global touches that used to live in a separate CSS file
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        ':focus-visible': { outline: `2px solid ${palette.brass}`, outlineOffset: '2px' },
        '::-webkit-scrollbar': { width: 10, height: 10 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(22,26,32,0.25)',
          borderRadius: 9999,
          border: '2px solid transparent',
          backgroundClip: 'content-box',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
  },
});

export default theme;
