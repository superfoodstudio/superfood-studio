'use client';

import { Suspense } from 'react';
import { View, Text } from 'reshaped';
import { RelayEnvironmentProvider } from 'react-relay';
import { createRelayEnvironment } from '@/lib/relay/environment';

function ShopContent() {
  return (
    <View direction="column" gap={6} padding={8}>
      <Text variant="title-2">Shop</Text>
      <Text>
        Browse our collection of superfood products. Pagination will be implemented shortly.
      </Text>
    </View>
  );
}

export default function ShopPage() {
  // Create a new environment for this page
  const environment = createRelayEnvironment();
  
  return (
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={
        <View padding={8}>
          <Text>Loading products...</Text>
        </View>
      }>
        <ShopContent />
      </Suspense>
    </RelayEnvironmentProvider>
  );
} 