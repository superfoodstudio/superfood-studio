'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReshapedProvider } from '@/components/providers/ReshapedProvider';
import { Navigation } from '@/components/layout/Navigation';
import dynamic from 'next/dynamic';

// Import RelayProvider with SSR disabled
const RelayProvider = dynamic(
  () => import('@/components/providers/RelayProvider').then(mod => mod.RelayProvider),
  { ssr: false }
);

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  // Ensure we're in the client environment
  if (typeof window === 'undefined') {
    return null;
  }

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
        <RelayProvider>
          <Navigation />
          {children}
        </RelayProvider>
      </ReshapedProvider>
    </PrivyProvider>
  );
} 