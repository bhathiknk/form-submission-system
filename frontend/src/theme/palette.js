// Plain color constants — no 'use client' here on purpose, so server
// components (like the home page) can import these hex values directly
// without pulling the whole MUI theme across the server/client boundary.
export const palette = {
  ink: '#161A20',
  paper: '#F7F5F1',
  brass: '#B8863F',
  brassDark: '#8E6529',
  moss: '#3E5C4A',
  rust: '#A8442E',
  slate950: '#0D1117',
};
