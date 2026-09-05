// Plain color constants — no 'use client' here on purpose, so server
// components (like the home page) can import these hex values directly
// without pulling the whole MUI theme across the server/client boundary.
export const palette = {
  ink: '#14161F',
  paper: '#F5F6FB',
  indigo: '#4F46E5',
  indigoDark: '#3E37B8',
  teal: '#0D9C90',
  coral: '#F1633C',
  slate950: '#0B0C14',
};
