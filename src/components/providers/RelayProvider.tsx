'use client';

import React from 'react';

// Import react-relay only on the client side
let RelayEnvironmentProvider: any = null;
let createRelayEnvironment: any = null;

// Only attempt to load Relay components on the client
if (typeof window !== 'undefined') {
  // Using require instead of import to avoid SSR loading
  const reactRelay = require('react-relay');
  const relayEnv = require('@/lib/relay/environment');
  
  RelayEnvironmentProvider = reactRelay.RelayEnvironmentProvider;
  createRelayEnvironment = relayEnv.createRelayEnvironment;
}

export function RelayProvider({ children }: { children: React.ReactNode }) {
  // On server, just return children
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  // Ensure relay components are loaded
  if (!RelayEnvironmentProvider || !createRelayEnvironment) {
    return <>{children}</>;
  }

  // Create environment
  const environment = createRelayEnvironment();
  if (!environment) {
    return <>{children}</>;
  }

  // Use provider only on client
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
} 