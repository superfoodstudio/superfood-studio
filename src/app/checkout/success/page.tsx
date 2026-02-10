'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { QueryErrorBoundary } from '@/components/ui/QueryErrorBoundary';
import Link from 'next/link';
import { useLazyLoadQuery } from 'react-relay';
import { AppContainer } from '@/components/layout/AppContainer';
import { View, Text, Button, Divider } from 'reshaped';
import { OrderByPaymentIntentQuery } from '@/app/dashboard/orders/OrderQueries';
import type { OrderQueriesOrderByPaymentIntentQuery } from '@/__generated__/OrderQueriesOrderByPaymentIntentQuery.graphql';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');

  if (!paymentIntentId) {
    return (
      <AppContainer maxWidth={600}>
        <View direction="column" align="center" padding={8} gap={4}>
          <Text variant="title-5" color="critical">Order Not Found</Text>
          <Text>No payment information found.</Text>
          <Link href="/"><Button variant="solid">Continue Shopping</Button></Link>
        </View>
      </AppContainer>
    );
  }

  const data = useLazyLoadQuery<OrderQueriesOrderByPaymentIntentQuery>(
    OrderByPaymentIntentQuery,
    { paymentIntentId }
  );

  if (!data.orderByPaymentIntent) {
    return (
      <AppContainer maxWidth={600}>
        <View direction="column" align="center" padding={8} gap={4}>
          <Text variant="title-5" color="critical">Order Not Found</Text>
          <Text>We couldn't find details for this order.</Text>
          <Link href="/"><Button variant="solid">Continue Shopping</Button></Link>
        </View>
      </AppContainer>
    );
  }

  const orderDetails = data.orderByPaymentIntent;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AppContainer>
      <View direction="column" padding={4} gap={6}>
        <View direction="column" align="center" gap={4}>
          <View 
            width="64px" 
            height="64px" 
            backgroundColor="positive" 
            borderRadius="circular"
            attributes={{ 
              style: { 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              } 
            }}
          >
            <Text variant="title-2" color="positive">✓</Text>
          </View>
          <Text variant="title-4" align="center">Thank You For Your Order!</Text>
          <Text align="center" color="neutral-faded">
            Your order has been processed successfully. We'll send you updates as we prepare your items.
          </Text>
        </View>
        
        <View 
          direction="column" 
          gap={4} 
          padding={6} 
          backgroundColor="elevation-base" 
          borderRadius="medium"
          width={{ s: '100%', m: '600px' }}
          attributes={{ style: { margin: '0 auto' } }}
        >
          <Text variant="featured-1">Order Details</Text>
          <Divider />
          
          <View direction="row" justify="space-between">
            <Text weight="medium">Order Number:</Text>
            <Text>{orderDetails.id.slice(-8).toUpperCase()}</Text>
          </View>
          
          <View direction="row" justify="space-between">
            <Text weight="medium">Order Date:</Text>
            <Text>{formatDate(orderDetails.createdAt)}</Text>
          </View>
          
          <View direction="row" justify="space-between">
            <Text weight="medium">Status:</Text>
            <Text color="positive">{orderDetails.status}</Text>
          </View>
          
          <Divider />
          
          <Text weight="medium">Items:</Text>
          <View direction="column" gap={2}>
            {orderDetails.items.map((item) => (
              <View key={item.id} direction="row" justify="space-between" padding={2}>
                <Text>
                  {item.product.name} (×{item.quantity})
                </Text>
                <Text>{formatPrice(item.price * item.quantity)}</Text>
              </View>
            ))}
          </View>
          
          <Divider />
          <View direction="row" justify="space-between">
            <Text variant="title-4">Total:</Text>
            <Text variant="title-4">{formatPrice(orderDetails.total)}</Text>
          </View>
        </View>
        
        <View direction="row" justify="center" gap={3}>
          <Link href="/dashboard/orders"><Button variant="outline">View All Orders</Button></Link>
          <Link href="/"><Button variant="solid">Continue Shopping</Button></Link>
        </View>
      </View>
    </AppContainer>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={
        <AppContainer maxWidth={600}>
          <View direction="column" align="center" padding={8}>
            <Text variant="featured-3">Processing Your Order...</Text>
            <Text>Please wait while we confirm your order details.</Text>
          </View>
        </AppContainer>
      }>
        <CheckoutSuccessContent />
      </Suspense>
    </QueryErrorBoundary>
  );
} 