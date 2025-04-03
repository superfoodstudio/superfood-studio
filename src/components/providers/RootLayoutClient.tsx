'use client';

import { Reshaped } from 'reshaped';
import { PrivyProvider } from '@privy-io/react-auth';
import '../../themes/superfood/theme.css';

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <Reshaped theme="superfood">
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['email'],
          appearance: {
            theme: 'light',
            accentColor: '#2E1A47',
          },
        }}
      >
        {children}
      </PrivyProvider>
    </Reshaped>
  );
} 