'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReshapedProvider } from '@/components/providers/ReshapedProvider';
import { Navigation } from '@/components/layout/Navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Import the RelayProvider with SSR disabled completely
const RelayProvider = dynamic(
  () => import('@/components/providers/RelayProvider').then(mod => mod.RelayProvider),
  { 
    ssr: false,
    loading: () => <>{/* Loading placeholder */}</>
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
          {/* Wrap only Relay-dependent content in RelayProvider */}
          <RelayProvider>
            {children}
          </RelayProvider>
        </Suspense>
      </ReshapedProvider>
    </PrivyProvider>
  );
} 