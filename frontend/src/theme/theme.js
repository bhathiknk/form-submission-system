'use client';

import { createTheme } from '@mui/material/styles';
import { palette } from './palette';

// Shared theme: both the public site and the admin area pull from this,
// admin pages just flip a few surface colors to dark via component props.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: palette.indigo, dark: palette.indigoDark, contrastText: '#FFFFFF' },
    secondary: { main: palette.teal, contrastText: '#FFFFFF' },
    error: { main: palette.coral },
    background: { default: palette.paper, paper: '#FFFFFF' },
    text: { primary: palette.ink, secondary: '#5D6070' },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'var(--font-sans), system-ui, sans-serif',
    h1: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em' },
    h2: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600, letterSpacing: '-0.02em' },
    h3: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontFamily: 'var(--font-serif), Georgia, serif', fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 700, letterSpacing: '-0.01em' },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    // soft, modern buttons — gentle tinted shadow on primary instead of flat or glossy
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 10, boxShadow: 'none', paddingTop: 9, paddingBottom: 9 },
        containedPrimary: {
          boxShadow: '0 6px 16px -4px rgba(79,70,229,0.45)',
          '&:hover': { boxShadow: '0 8px 20px -4px rgba(79,70,229,0.55)' },
        },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        outlined: { borderWidth: 1.5, '&:hover': { borderWidth: 1.5 } },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    // small global touches that used to live in a separate CSS file
    MuiCssBaseline: {
      styleOverrides: {
        html: { scrollBehavior: 'smooth' },
        ':focus-visible': { outline: `2px solid ${palette.indigo}`, outlineOffset: '2px' },
        '::-webkit-scrollbar': { width: 10, height: 10 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(20,22,31,0.22)',
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
