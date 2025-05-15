'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReshapedProvider } from '@/components/providers/ReshapedProvider';
import { Navigation } from '@/components/layout/Navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the RelayProvider with SSR disabled completely
const ClientOnly = dynamic(
  () => import('@/components/providers/ClientOnly').then(mod => mod.ClientOnly),
  { 
    ssr: false,
    loading: () => <div>Loading application...</div>
  }
);

// Log when this component renders - helps with debugging
console.log('Root Layout - Privy App ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID);

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
      }}
    >
      <ReshapedProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Navigation />
          {/* Use a client-only wrapper instead of directly embedding RelayProvider */}
          <ClientOnly>
            {children}
          </ClientOnly>
        </Suspense>
      </ReshapedProvider>
    </PrivyProvider>
  );
} 