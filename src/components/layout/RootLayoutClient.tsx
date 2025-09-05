'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { ReshapedProvider } from '@/components/providers/ReshapedProvider';
import { Navigation } from '@/components/layout/Navigation';
import { View } from 'reshaped';
import { RelayProvider } from '@/components/providers/RelayProvider';

// Log when this component renders - helps with debugging
console.log('Root Layout - Privy App ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID);

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <ReshapedProvider>
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
        <RelayProvider>
          <View backgroundColor="page" minHeight="100vh">
            <Navigation />
            {children}
          </View>
        </RelayProvider>
      </PrivyProvider>
    </ReshapedProvider>
  );
} 