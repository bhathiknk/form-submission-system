import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import ToastProvider from '../components/ToastProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif', display: 'swap' });

export const metadata = {
  title: 'Evotec Records | Client Intake Platform',
  description: 'Secure customer intake and admin review platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
