import './globals.css';
import { AppProviders } from './providers';
import { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import { Navbar } from '@/components/Navbar';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-cormorant',
});

export const metadata: Metadata = {
  title: 'Bertrand - Votre Butler Personnel',
  description: 'Un assistant conversationnel élégant et raffiné',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="min-h-screen">
      <body className={`bg-[#0f172a] text-[#fdf6e3] min-h-screen ${cormorantGaramond.variable}`}>
        <AppProviders>
          <Navbar />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}