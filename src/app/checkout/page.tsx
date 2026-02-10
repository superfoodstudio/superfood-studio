'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useCart } from '@/hooks/useCart';
import { AppContainer } from '@/components/layout/AppContainer';
import { View, Text, Button, Divider } from 'reshaped';
import { FormSkeleton } from '@/components/ui/ListSkeleton';
import { StripeProvider } from '@/components/providers/StripeProvider';
import { PaymentForm } from '@/components/checkout/PaymentForm';

// Format currency
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

function CartSummary({ cart }: { cart: any }) {
  if (!cart || cart.items.length === 0) {
    return (
      <View direction="column" gap={2} padding={4} backgroundColor="elevation-base" attributes={{ style: { borderRadius: '8px' } }}>
        <Text color="critical">Cart is empty</Text>
      </View>
    );
  }

  return (
    <View direction="column" gap={2} padding={4} backgroundColor="elevation-base" attributes={{ style: { borderRadius: '8px' } }}>
      <Text variant="featured-1">Order Summary</Text>
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
        <Text variant="title-6">Total</Text>
        <Text variant="title-6">{formatPrice(cart.total)}</Text>
      </View>
    </View>
  );
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
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
  const { ready, authenticated, user, getAccessToken } = usePrivy();
  const { cart } = useCart();

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

  // Check if cart is empty and redirect
  useEffect(() => {
    if (ready && cart && cart.items.length === 0) {
      router.push('/cart');
    }
  }, [ready, cart, router]);

  // Handle loading and authentication states after all hooks
  if (!isReady) {
    return <AppContainer maxWidth={800}><FormSkeleton /></AppContainer>;
  }

  if (!authenticated) {
    return null;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function createPaymentIntent() {
    setIsLoading(true);
    setError(null);

    try {
      // Check if cart has items
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      // Get auth token for API request
      const token = await getAccessToken();
      
      // Convert cart items to the format expected by API
      const cartItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.product.name,
        productPhoto: item.product.photoUrl
      }));

      // Prepare shipping address
      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      };
      
      // Create payment intent with shipping address
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          cartItems,
          shippingAddress
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    // Navigate to success page with payment intent ID
    router.push(`/checkout/success?payment_intent=${paymentIntentId}`);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <StripeProvider>
      <AppContainer maxWidth={800}>
        <View direction="column" gap={4} padding={4}>
          <Text variant="title-4" align="center">Checkout</Text>
          
          {error && (
            <View direction="column" align="center" padding={4} backgroundColor="critical-faded">
              <Text color="critical">{error}</Text>
            </View>
          )}
          
          <View direction="row" gap={6} attributes={{ style: { flexWrap: 'wrap' } }}>
            {/* Shipping Information */}
            <View direction="column" gap={4} attributes={{ style: { flex: 1 } }}>
              <View direction="column" gap={2} padding={4} backgroundColor="elevation-base" attributes={{ style: { borderRadius: '8px' } }}>
                <Text variant="featured-1">Shipping Information</Text>
                <Divider />
                
                <View direction="column" gap={3}>
                  <View direction="row" gap={2}>
                    <View direction="column" gap={1} grow>
                      <label htmlFor="firstName"><Text>First Name</Text></label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <label htmlFor="lastName"><Text>Last Name</Text></label>
                      <input
                        id="lastName"
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
                    <label htmlFor="email"><Text>Email</Text></label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border rounded"
                    />
                  </View>
                  
                  <View direction="column" gap={1}>
                    <label htmlFor="street"><Text>Street Address</Text></label>
                    <input
                      id="street"
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
                      <label htmlFor="city"><Text>City</Text></label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <label htmlFor="state"><Text>State</Text></label>
                      <input
                        id="state"
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
                      <label htmlFor="zipCode"><Text>ZIP Code</Text></label>
                      <input
                        id="zipCode"
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <label htmlFor="country"><Text>Country</Text></label>
                      <select
                        id="country"
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
                </View>
              </View>

              {/* Payment Form */}
              <View direction="column" gap={2} padding={4} backgroundColor="elevation-base" attributes={{ style: { borderRadius: '8px' } }}>
                {!clientSecret ? (
                  <View direction="column" gap={3}>
                    <Button
                      variant="solid"
                      onClick={createPaymentIntent}
                      disabled={isLoading}
                      fullWidth
                    >
                      {isLoading ? 'Preparing Payment...' : 'Continue to Payment'}
                    </Button>
                  </View>
                ) : (
                  <PaymentForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}
              </View>

              <View direction="row" gap={2}>
                <Button
                  variant="outline"
                  onClick={() => router.push('/cart')}
                >
                  Return to Cart
                </Button>
              </View>
            </View>
            
            {/* Order Summary */}
            <View width={{ s: '100%', m: '300px' }}>
              <CartSummary cart={cart} />
            </View>
          </View>
        </View>
      </AppContainer>
    </StripeProvider>
  );
}