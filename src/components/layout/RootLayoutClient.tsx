'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReshapedProvider } from '@/components/providers/ReshapedProvider';
import { Navigation } from '@/components/layout/Navigation';
import { View } from 'reshaped';
import dynamic from 'next/dynamic';

// Import the ClientOnly component with SSR disabled completely
const ClientOnly = dynamic(
  () => import('@/components/providers/ClientOnly').then(mod => mod.ClientOnly),
  { 
    ssr: false
  }
);

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
        {/* Use a client-only wrapper for everything to prevent hydration mismatch */}
        <ClientOnly>
          <View backgroundColor="page" minHeight="100vh">
            <Navigation />
            {children}
          </View>
        </ClientOnly>
      </ReshapedProvider>
    </PrivyProvider>
  );
} 