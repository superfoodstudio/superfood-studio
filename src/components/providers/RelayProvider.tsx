'use client';

import React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createRelayEnvironment } from '@/lib/relay/environment';

export function RelayProvider({ children }: { children: React.ReactNode }) {
  // Only create the environment on the client side
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  // Safe to use createRelayEnvironment on the client
  const environment = createRelayEnvironment();
  
  // Make sure we have an environment before using the provider
  if (!environment) {
    return <>{children}</>;
  }

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
} 