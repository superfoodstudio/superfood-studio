'use client';

import { Suspense, useState, useEffect } from 'react';
import { View, Text, Skeleton } from 'reshaped';
import { CartContents } from '@/components/cart/CartContents';
import { AppContainer } from '@/components/layout/AppContainer';
import Link from 'next/link';

// Error boundary fallback component
function CartErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <View direction="column" align="center" padding={8} gap={4}>
        <Text variant="title-5">Something went wrong</Text>
        <Text variant="body-1">We couldn't load your cart. Please try again later.</Text>
        <Link href="/shop">
          <Text color="primary">Continue Shopping</Text>
        </Link>
      </View>
    );
  }

  return children;
}

export default function CartPage() {
  return (
    <AppContainer maxWidth={800}>
      <CartErrorBoundary>
        <Suspense fallback={
          <View direction="column" gap={4} padding={4}>
            {[1, 2, 3].map((i) => (
              <View key={i} direction="row" gap={4} align="center" attributes={{ style: { borderBottom: '1px solid #eaeaea', paddingBottom: '16px' } }}>
                <Skeleton width="60px" height="60px" borderRadius="small" />
                <View direction="column" gap={2} attributes={{ style: { flex: 1 } }}>
                  <Skeleton height="1rem" width="60%" borderRadius="small" />
                  <Skeleton height="0.875rem" width="30%" borderRadius="small" />
                </View>
                <Skeleton height="1rem" width="60px" borderRadius="small" />
              </View>
            ))}
          </View>
        }>
          <CartContents />
        </Suspense>
      </CartErrorBoundary>
    </AppContainer>
  );
} 