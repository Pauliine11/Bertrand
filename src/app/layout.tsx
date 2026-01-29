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
  title: 'Le Grimoire Éveillé - Jeu de Rôle Poudlard',
  description: 'Jeu de rôle immersif dans l\'univers de Poudlard propulsé par l\'IA',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className="dark min-h-screen" suppressHydrationWarning>
        <body className={`bg-gray-900 text-gray-100 min-h-screen ${geistSans.variable} ${geistMono.variable} ${cormorantGaramond.variable} font-sans antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
            forcedTheme="dark"
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
