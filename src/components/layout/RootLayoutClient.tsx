'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReshapedProvider } from '@/components/providers/ReshapedProvider';
import { Navigation } from '@/components/layout/Navigation';
import { View } from 'reshaped';
import dynamic from 'next/dynamic';

// Single dynamic boundary — replaces the triple-nested ClientOnly → RelayProvider chain
const RelayProvider = dynamic(
  () => import('@/components/providers/RelayProvider').then(mod => mod.RelayProvider),
  { ssr: false }
);

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email'],
        appearance: {
          theme: 'light',
          accentColor: '#4C263C',
          walletList: [],
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
      }}
    >
      <ReshapedProvider>
        <RelayProvider>
          <View backgroundColor="page" minHeight="100vh">
            <Navigation />
            {children}
          </View>
        </RelayProvider>
      </ReshapedProvider>
    </PrivyProvider>
  );
}
