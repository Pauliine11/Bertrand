'use client';

import { useState, useCallback, createContext, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useIsMobile } from './useMediaQuery';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false); // Fermé par défaut pour éviter le flash

  // Auto-fermer la sidebar sur mobile, auto-ouvrir sur desktop
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = { isOpen, toggle, open, close, isMobile };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
