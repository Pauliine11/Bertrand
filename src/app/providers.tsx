'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';
import { SidebarProvider } from '@/hooks/useSidebar';
import { ChatProvider } from '@/context/ChatContext';

const queryClient = new QueryClient();

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
      </ChatProvider>
    </QueryClientProvider>
  );
};