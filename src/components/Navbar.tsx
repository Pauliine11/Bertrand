'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BertrandLogo } from './BertrandLogo';

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#722f37] via-[#8b2635] to-[#722f37] border-b-2 border-[#d4af37] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Titre */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group">
              {/* Logo SVG */}
              <BertrandLogo className="h-12 w-12 transition-transform group-hover:scale-110" />
              {/* Texte à côté du logo */}
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                pathname === '/'
                  ? 'bg-[#d4af37] text-[#722f37] font-bold'
                  : 'text-[#fdf6e3] hover:bg-[#722f37]/50 hover:text-[#d4af37] border border-[#d4af37]/30'
              }`}
            >
              💬 Chat
            </Link>
            
            <Link
              href="/bertrand-editor-space"
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                pathname === '/bertrand-editor-space'
                  ? 'bg-[#d4af37] text-[#722f37] font-bold'
                  : 'text-[#fdf6e3] hover:bg-[#722f37]/50 hover:text-[#d4af37] border border-[#d4af37]/30'
              }`}
            >
              📝 Éditeur
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

