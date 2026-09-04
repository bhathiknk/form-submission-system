import { Inter, Newsreader } from 'next/font/google';
import ThemeRegistry from '../theme/ThemeRegistry';
import { AuthProvider } from '../context/AuthContext';
import ToastProvider from '../components/ToastProvider';

// sans for UI/body text, serif for headings — gives the "records ledger" feel
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const newsreader = Newsreader({ subsets: ['latin'], variable: '--font-serif', display: 'swap', weight: ['500', '600', '700'] });

export const metadata = {
  title: 'Evotec Records | Client Intake Platform',
  description: 'Secure customer intake and admin review platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${newsreader.variable}`}>
      <body>
        <ThemeRegistry>
          <AuthProvider>
            {children}
            <ToastProvider />
          </AuthProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
