'use client';

import { Suspense } from 'react';
import { View, Text } from 'reshaped';
import { CartContents } from '@/components/cart/CartContents';
import { AppContainer } from '@/components/layout/AppContainer';

export default function CartPage() {
  return (
    <AppContainer maxWidth={800}>
      <Suspense fallback={<Text align="center">Loading your cart...</Text>}>
        <CartContents />
      </Suspense>
    </AppContainer>
  );
} 