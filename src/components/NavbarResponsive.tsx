'use client';

import { useSidebar } from '@/hooks/useSidebar';
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
  const isRPG = variant === 'immersive';

  const theme = {
    nav: isRPG ? 'bg-gray-950/80 border-gray-800 shadow-lg shadow-indigo-900/10' : 'bg-white/80 border-gray-200 shadow-sm',
    text: isRPG ? 'text-indigo-100' : 'text-gray-900',
    icon: isRPG ? 'text-indigo-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100:bg-slate-800',
    button: isRPG ? 'bg-indigo-600 text-white hover:bg-indigo-500 border border-indigo-500' : 'minimal-button',
    buttonSecondary: isRPG ? 'text-indigo-200 hover:text-white hover:bg-white/10' : 'minimal-button-secondary'
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
          <h1 className={`text-base sm:text-lg md:text-xl font-bold tracking-tight ${theme.text}`}>
            <span className="hidden md:inline">BERTRAND - Votre Butler Personnel</span>
            <span className="md:hidden">BERTRAND</span>
          </h1>
        </div>

        {/* Authentification Clerk à droite */}
        <div className="flex items-center gap-2 md:gap-3">
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

