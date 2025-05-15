'use client';

import React, { useMemo } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createRelayEnvironment } from '@/lib/relay/environment';

export function RelayProvider({ children }: { children: React.ReactNode }) {
  // Create the environment (this will be a no-op on the server)
  const environment = useMemo(() => {
    // Only create a real environment in the browser
    if (typeof window === 'undefined') {
      return null;
    }
    return createRelayEnvironment();
  }, []);

  // In server environment, just return children without the RelayEnvironmentProvider
  if (typeof window === 'undefined' || !environment) {
    return <>{children}</>;
  }

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
} 