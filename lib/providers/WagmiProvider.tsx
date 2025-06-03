'use client';

import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/config/wagmi';
import { useMemo } from 'react';

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  // Create a QueryClient instance
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <WagmiProviderBase config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}
