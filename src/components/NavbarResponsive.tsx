'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { useLanguage } from '@/context/LanguageContext';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

interface NavbarProps {
  variant?: 'default' | 'immersive';
}

export function NavbarResponsive({ variant = 'default' }: NavbarProps) {
  const { isOpen, toggle, isMobile } = useSidebar();
  const { language, setLanguage, t } = useLanguage();
  const isRPG = variant === 'immersive';

  const theme = {
    nav: isRPG 
      ? 'bg-gray-900/95 border-gray-700/50 shadow-lg' 
      : 'bg-white/80 border-gray-200 shadow-sm',
    text: isRPG ? 'text-gray-100' : 'text-gray-900',
    icon: isRPG ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-700 hover:bg-gray-100',
    button: isRPG 
      ? 'bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50' 
      : 'minimal-button',
    buttonSecondary: isRPG 
      ? 'text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700' 
      : 'minimal-button-secondary'
  };

  return (
    <nav className={`fixed top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ease-in-out ${theme.nav} ${
      isMobile ? 'left-0 right-0' : (isOpen ? 'left-64 right-0' : 'left-16 right-0')
    }`}>
      <div className="h-16 flex items-center justify-between px-4 md:px-8">
        {/* Bouton Menu Hamburger (Mobile uniquement) */}
        {isMobile && (
          <button
            onClick={toggle}
            className={`p-2 rounded-lg transition-all active:scale-95 ${theme.icon}`}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        )}

        {/* Titre - responsive */}
        <div className="flex-1 flex justify-center md:justify-start">
          <h1 className={`text-base sm:text-lg md:text-xl font-semibold ${theme.text}`}>
            <span className="hidden md:inline">{t('nav.title')}</span>
            <span className="md:hidden">{t('nav.titleShort')}</span>
          </h1>
        </div>

        {/* Language Selector + Authentification Clerk à droite */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                language === 'fr'
                  ? isRPG 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-900 text-white'
                  : isRPG
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                language === 'en'
                  ? isRPG 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-900 text-white'
                  : isRPG
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              EN
            </button>
          </div>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className={`${theme.buttonSecondary} text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-colors`}>
                <span className="hidden sm:inline">S&apos;inscrire</span>
                <span className="sm:hidden">Inscription</span>
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className={`${theme.button} text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-colors`}>
                <span className="hidden sm:inline">Se connecter</span>
                <span className="sm:hidden">Connexion</span>
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-200"
                }
              }}
            />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

