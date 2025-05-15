'use client';

import { Suspense, useState, useEffect } from 'react';
import { View, Text } from 'reshaped';
import { CartContents } from '@/components/cart/CartContents';
import { AppContainer } from '@/components/layout/AppContainer';
import Link from 'next/link';

// Error boundary fallback component
function CartErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Cart error caught:', event.error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <View direction="column" align="center" padding={8} gap={4}>
        <Text variant="title-2">Something went wrong</Text>
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
        <Suspense fallback={<Text align="center">Loading your cart...</Text>}>
          <CartContents />
        </Suspense>
      </CartErrorBoundary>
    </AppContainer>
  );
} 