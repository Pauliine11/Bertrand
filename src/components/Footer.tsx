'use client';

import { useSidebar } from '@/hooks/useSidebar';

interface FooterProps {
  variant?: 'default' | 'immersive';
}

export function Footer({ variant = 'default' }: FooterProps) {
  const { isOpen, isMobile } = useSidebar();
  const isRPG = variant === 'immersive';
  const currentYear = new Date().getFullYear();

  const theme = {
    footer: isRPG ? 'bg-gray-950/80 border-gray-800 shadow-lg shadow-indigo-900/10' : 'bg-white/80 border-gray-200 shadow-sm',
    text: isRPG ? 'text-gray-500' : 'text-gray-600',
    highlight: isRPG ? 'text-gray-300' : 'text-gray-900',
    iconHover: isRPG ? 'hover:text-indigo-400' : 'hover:text-gray-900',
    badge: isRPG ? 'bg-gray-900 border-gray-700 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-700'
  };

  return (
    <footer className={`fixed bottom-0 right-0 z-40 backdrop-blur-md border-t transition-all duration-300 ease-in-out ${theme.footer} ${
      isMobile ? 'left-0' : (isOpen ? 'left-64' : 'left-16')
    }`}>
      <div className="px-4 md:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          {/* Copyright */}
          <div className={`flex items-center gap-2 ${theme.text}`}>
            <span className="text-gray-400">©</span>
            <span>{currentYear}</span>
            <span className={`font-semibold ${theme.highlight}`}>
              Nylorion
            </span>
            <span className="hidden md:inline text-gray-500">- Tous droits réservés</span>
          </div>

          {/* Separator */}
          <div className={`hidden md:block h-4 w-px ${isRPG ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

          {/* Tech Stack */}
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <div className={`flex items-center gap-1.5 transition-colors duration-200 group ${theme.iconHover}`}>
              <span className="group-hover:scale-110 transition-transform duration-200">⚡</span>
              <span>Next.js</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors duration-200 group ${theme.iconHover}`}>
              <span className="group-hover:scale-110 transition-transform duration-200">🤖</span>
              <span>OpenAI</span>
            </div>
            <div className={`flex items-center gap-1.5 transition-colors duration-200 group ${theme.iconHover}`}>
              <span className="group-hover:scale-110 transition-transform duration-200">🔐</span>
              <span>Clerk</span>
            </div>
          </div>

          {/* Version Badge */}
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 border rounded-full ${theme.badge}`}>
              <span className="font-semibold text-xs">v2.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
