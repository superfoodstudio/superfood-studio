'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery } from 'react-relay';
import { CartQuery } from '@/graphql/queries/CartQueries';
import { AppContainer } from '@/components/layout/AppContainer';
import { View, Text, Button, Divider } from 'reshaped';

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  // Set isReady to true when component mounts
  useEffect(() => {
    setIsReady(true);
    
    // Populate email if available
    if (user?.email?.address) {
      setFormData(prev => ({
        ...prev,
        email: user.email?.address || ''
      }));
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/cart');
    }
  }, [ready, authenticated, router]);

  if (!isReady) {
    return <AppContainer><Text align="center">Loading checkout...</Text></AppContainer>;
  }

  // Don't try to fetch cart if not authenticated
  if (!authenticated) {
    return null;
  }

  // This is a client component, so we can use hooks conditionally after the initial checks
  const CartSummary = () => {
    try {
      const data: any = useLazyLoadQuery(CartQuery, {});
      const cart = data.cart;
      
      if (!cart || cart.items.length === 0) {
        router.push('/cart');
        return null;
      }
      
      // Format currency
      const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(price);
      };
      
      return (
        <View direction="column" gap={2} padding={4} backgroundColor="elevation-base" attributes={{ style: { borderRadius: '8px' } }}>
          <Text variant="title-3">Order Summary</Text>
          <Divider />
          
          {cart.items.map((item: any) => (
            <View key={item.id} direction="row" justify="space-between" padding={1}>
              <Text>
                {item.product.name} ({item.quantity})
              </Text>
              <Text>{formatPrice(item.price * item.quantity)}</Text>
            </View>
          ))}
          
          <Divider />
          <View direction="row" justify="space-between">
            <Text variant="title-4">Total</Text>
            <Text variant="title-4">{formatPrice(cart.total)}</Text>
          </View>
        </View>
      );
    } catch (error) {
      console.error('Error loading cart:', error);
      return (
        <View direction="column" gap={2} padding={4} backgroundColor="elevation-base" attributes={{ style: { borderRadius: '8px' } }}>
          <Text color="critical">Error loading cart</Text>
        </View>
      );
    }
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Send checkout data to API endpoint
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingAddress: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          // Include billing address if different
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const data = await response.json();
      
      // Redirect to Stripe Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your payment. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <AppContainer>
      <View direction="column" gap={4} padding={4}>
        <Text variant="title-1" align="center">Checkout</Text>
        
        <View direction="row" gap={6} attributes={{ style: { flexWrap: 'wrap' } }}>
          {/* Shipping Information */}
          <View direction="column" gap={4} attributes={{ style: { flex: 1 } }}>
            <View direction="column" gap={2} padding={4} backgroundColor="elevation-base" attributes={{ style: { borderRadius: '8px' } }}>
              <Text variant="title-3">Shipping Information</Text>
              <Divider />
              
              <form onSubmit={handleSubmit}>
                <View direction="column" gap={3}>
                  <View direction="row" gap={2}>
                    <View direction="column" gap={1} grow>
                      <Text>First Name</Text>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <Text>Last Name</Text>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                  </View>
                  
                  <View direction="column" gap={1}>
                    <Text>Email</Text>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </View>
                  
                  <View direction="column" gap={1}>
                    <Text>Street Address</Text>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </View>
                  
                  <View direction="row" gap={2}>
                    <View direction="column" gap={1} grow>
                      <Text>City</Text>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <Text>State</Text>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                  </View>
                  
                  <View direction="row" gap={2}>
                    <View direction="column" gap={1} grow>
                      <Text>ZIP Code</Text>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <Text>Country</Text>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                      </select>
                    </View>
                  </View>
                  
                  <View direction="column" gap={2} padding={2}>
                    <Text>Payment Method</Text>
                    <Text variant="body-2" color="neutral-faded">
                      You will be redirected to our secure payment provider to complete your purchase.
                    </Text>
                  </View>
                  
                  <View direction="row" gap={2}>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/cart')}
                    >
                      Return to Cart
                    </Button>
                    <Button
                      variant="solid"
                      type="submit"
                      disabled={isLoading}
                      fullWidth
                    >
                      {isLoading ? 'Processing...' : 'Complete Purchase'}
                    </Button>
                  </View>
                </View>
              </form>
            </View>
          </View>
          
          {/* Order Summary */}
          <View width={{ s: '100%', m: '300px' }}>
            <CartSummary />
          </View>
        </View>
      </View>
    </AppContainer>
  );
} 