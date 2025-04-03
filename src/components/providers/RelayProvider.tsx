'use client';

import { RelayEnvironmentProvider } from 'react-relay';
import { createRelayEnvironment } from '@/lib/relay/environment';

const environment = createRelayEnvironment();

export function RelayProvider({ children }: { children: React.ReactNode }) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
} 