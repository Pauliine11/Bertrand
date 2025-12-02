'use client';

import { useSidebar } from '@/hooks/useSidebar';
import { ReactNode } from 'react';

export function LayoutContent({ children }: { children: ReactNode }) {
  const { isOpen, isMobile } = useSidebar();

  return (
    <div 
      className={`transition-all duration-500 ease-in-out relative min-h-screen pt-16 pb-20 ${
        isMobile 
          ? 'ml-0' // Pas de margin sur mobile
          : (isOpen ? 'ml-64' : 'ml-16') // Comportement normal desktop
      }`}
    >
      {/* 
        Mobile: ml-0 (sidebar en overlay)
        Desktop: 
          - pt-16: padding-top pour la navbar (64px)
          - pb-20: padding-bottom pour le footer (80px)
          - ml-64 (256px) quand sidebar ouverte
          - ml-16 (64px) quand sidebar fermée
      */}
      {children}
    </div>
  );
}

