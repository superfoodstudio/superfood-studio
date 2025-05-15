'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import RelayProvider with SSR disabled
const RelayProvider = dynamic(
  () => import('./RelayProvider').then(mod => mod.RelayProvider),
  { ssr: false }
);

export function ClientOnly({ children }: { children: React.ReactNode }) {
  // State to track if we're in the browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render children on the client
  if (!isMounted) {
    return null;
  }

  // Once mounted on client, use RelayProvider
  return (
    <RelayProvider>
      {children}
    </RelayProvider>
  );
} 