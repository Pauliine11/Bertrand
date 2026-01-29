'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { SidebarProvider } from '@/hooks/useSidebar';
import { LanguageProvider } from '@/context/LanguageContext';

const queryClient = new QueryClient();

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};