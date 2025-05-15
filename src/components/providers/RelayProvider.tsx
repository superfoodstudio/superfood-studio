'use client';

import React, { useMemo } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createRelayEnvironment } from '@/lib/relay/environment';

export function RelayProvider({ children }: { children: React.ReactNode }) {
  const environment = useMemo(() => createRelayEnvironment(), []);
  
  // Avoid React Relay code execution on server
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    return <>{children}</>;
  }

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
} 