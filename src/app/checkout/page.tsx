'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useCart } from '@/hooks/useCart';
import { AppContainer } from '@/components/layout/AppContainer';
import { View, Text, Button, Divider } from 'reshaped';
import { FormSkeleton } from '@/components/ui/ListSkeleton';
import { StripeProvider } from '@/components/providers/StripeProvider';
import { PaymentForm } from '@/components/checkout/PaymentForm';

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid var(--rs-color-border-neutral-faded)',
  borderRadius: '8px',
  fontSize: '14px',
  fontFamily: 'inherit',
  backgroundColor: '#fff',
  outline: 'none',
};

function CartSummary({ cart }: { cart: any }) {
  if (!cart || cart.items.length === 0) {
    return (
      <View direction="column" gap={2} padding={4} borderRadius="medium" attributes={{ style: { border: '1px solid var(--rs-color-border-neutral-faded)' } }}>
        <Text color="neutral-faded">Cart is empty</Text>
      </View>
    );
  }

  return (
    <View direction="column" gap={3} padding={5} borderRadius="medium" attributes={{ style: { border: '1px solid var(--rs-color-border-neutral-faded)' } }}>
      <Text variant="body-1" weight="bold" attributes={{ style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' } }}>
        Order Summary
      </Text>
      <Divider />

      {cart.items.map((item: any) => (
        <View key={item.id} direction="row" justify="space-between" align="center">
          <View direction="row" gap={2} align="center">
            <Text variant="body-2">{item.product.name}</Text>
            <Text variant="caption-1" color="neutral-faded">×{item.quantity}</Text>
          </View>
          <Text variant="body-2">{formatPrice(item.price * item.quantity)}</Text>
        </View>
      ))}

      <Divider />
      <View direction="row" justify="space-between">
        <Text variant="body-1" weight="bold">Total</Text>
        <Text variant="body-1" weight="bold">{formatPrice(cart.total)}</Text>
      </View>
    </View>
  );
}

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const paymentSucceeded = useRef(false);
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
  const { cart, clearCart } = useCart();

  useEffect(() => {
    setIsReady(true);
    if (user?.email?.address) {
      setFormData(prev => ({
        ...prev,
        email: user.email?.address || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/cart');
    }
  }, [ready, authenticated, router]);

  // Redirect if cart is empty (but not after successful payment)
  useEffect(() => {
    if (ready && cart && cart.items.length === 0 && !paymentSucceeded.current) {
      router.push('/cart');
    }
  }, [ready, cart, router]);

  if (!isReady) {
    return <AppContainer maxWidth={800}><FormSkeleton /></AppContainer>;
  }

  if (!authenticated) {
    return null;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function createPaymentIntent() {
    setIsLoading(true);
    setError(null);

    try {
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      const token = await getAccessToken();

      const cartItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        productName: item.product.name,
        productPhoto: item.product.photoUrl
      }));

      const shippingAddress = {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      };

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cartItems, shippingAddress }),
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

  const handlePaymentSuccess = async (_paymentIntentId: string) => {
    paymentSucceeded.current = true;
    clearCart();
    // Brief delay to allow webhook to process the order
    await new Promise(resolve => setTimeout(resolve, 2500));
    router.push('/dashboard/orders');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <StripeProvider>
      <AppContainer maxWidth={800}>
        <View direction="column" gap={6} padding={4}>
          <Text
            variant="featured-2"
            align="center"
            attributes={{
              style: {
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '600',
              },
            }}
          >
            Checkout
          </Text>

          {error && (
            <View padding={3} backgroundColor="critical-faded" borderRadius="medium">
              <Text color="critical" variant="body-2">{error}</Text>
            </View>
          )}

          <View direction={{ s: 'column', m: 'row' }} gap={6}>
            {/* Left Column — Forms */}
            <View direction="column" gap={4} attributes={{ style: { flex: 1 } }}>
              {/* Shipping Information */}
              <View direction="column" gap={4} padding={5} borderRadius="medium" attributes={{ style: { border: '1px solid var(--rs-color-border-neutral-faded)' } }}>
                <Text variant="body-1" weight="bold" attributes={{ style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' } }}>
                  Shipping Information
                </Text>
                <Divider />

                <View direction="column" gap={3}>
                  <View direction="row" gap={3}>
                    <View direction="column" gap={1} grow>
                      <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'firstName' }}>First Name</Text>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'lastName' }}>Last Name</Text>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                    </View>
                  </View>

                  <View direction="column" gap={1}>
                    <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'email' }}>Email</Text>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                    />
                  </View>

                  <View direction="column" gap={1}>
                    <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'street' }}>Street Address</Text>
                    <input
                      id="street"
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      required
                      style={inputStyle}
                    />
                  </View>

                  <View direction="row" gap={3}>
                    <View direction="column" gap={1} grow>
                      <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'city' }}>City</Text>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'state' }}>State</Text>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                    </View>
                  </View>

                  <View direction="row" gap={3}>
                    <View direction="column" gap={1} grow>
                      <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'zipCode' }}>ZIP Code</Text>
                      <input
                        id="zipCode"
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      />
                    </View>
                    <View direction="column" gap={1} grow>
                      <Text variant="body-2" weight="medium" as="label" attributes={{ htmlFor: 'country' }}>Country</Text>
                      <select
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="MX">Mexico</option>
                      </select>
                    </View>
                  </View>
                </View>
              </View>

              {/* Payment Section */}
              <View direction="column" gap={3} padding={5} borderRadius="medium" attributes={{ style: { border: '1px solid var(--rs-color-border-neutral-faded)' } }}>
                {!clientSecret ? (
                  <Button
                    variant="solid"
                    color="primary"
                    size="large"
                    onClick={createPaymentIntent}
                    disabled={isLoading}
                    fullWidth
                  >
                    {isLoading ? 'Preparing Payment...' : 'Continue to Payment'}
                  </Button>
                ) : (
                  <PaymentForm
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}
              </View>

              <Button
                variant="ghost"
                onClick={() => router.push('/cart')}
              >
                Return to Cart
              </Button>
            </View>

            {/* Right Column — Order Summary */}
            <View width={{ s: '100%', m: '280px' }}>
              <CartSummary cart={cart} />
            </View>
          </View>
        </View>
      </AppContainer>
    </StripeProvider>
  );
}
