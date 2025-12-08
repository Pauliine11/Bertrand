import './globals.css';
import './themes/minimal.css';
import { AppProviders } from './providers';
import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Metadata } from 'next';
import { Geist, Geist_Mono, Cormorant_Garamond } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from '@clerk/localizations'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Bertrand - Votre Butler Personnel',
  description: 'Un assistant conversationnel élégant et raffiné',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className="min-h-screen">
        <body className={`bg-white text-gray-900 min-h-screen ${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProviders>
              {children}
            </AppProviders>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
