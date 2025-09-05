'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { View, Text, Button } from 'reshaped';
import { usePrivy } from '@privy-io/react-auth';
import { useCart } from '@/hooks/useCart';

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

export function PaymentForm({ clientSecret, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = usePrivy();
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const cardNumber = elements.getElement(CardNumberElement);
    
    if (!cardNumber) {
      onError('Card information is incomplete');
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            email: user?.email?.address,
          },
        },
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        // Clear cart after successful payment
        clearCart();
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      onError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <View direction="column" gap={4}>
        <Text variant="title-3">Payment Information</Text>
        
        <View direction="column" gap={2}>
          <View direction="column" gap={1}>
            <Text>Card Number</Text>
            <div style={{ 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              backgroundColor: '#fff'
            }}>
              <CardNumberElement options={cardElementOptions} />
            </div>
          </View>
          
          <View direction="row" gap={2}>
            <View direction="column" gap={1} grow>
              <Text>Expiry Date</Text>
              <div style={{ 
                padding: '12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                backgroundColor: '#fff'
              }}>
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </View>
            
            <View direction="column" gap={1} grow>
              <Text>CVC</Text>
              <div style={{ 
                padding: '12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                backgroundColor: '#fff'
              }}>
                <CardCvcElement options={cardElementOptions} />
              </div>
            </View>
          </View>
        </View>

        <Button
          type="submit"
          variant="solid"
          fullWidth
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay $${(cart.total).toFixed(2)}`}
        </Button>
      </View>
    </form>
  );
}