/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#161A20',
        slate: {
          950: '#0D1117',
        },
        paper: '#F7F5F1',
        brass: '#B8863F',
        brassdark: '#8E6529',
        moss: '#3E5C4A',
        rust: '#A8442E',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      maxWidth: {
        prose: '72ch',
      },
    },
  },
  plugins: [],
};
