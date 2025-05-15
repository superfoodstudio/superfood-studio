'use client';

import React, { useMemo } from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { createRelayEnvironment } from '@/lib/relay/environment';

export function RelayProvider({ children }: { children: React.ReactNode }) {
  const environment = useMemo(() => createRelayEnvironment(), []);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
} 