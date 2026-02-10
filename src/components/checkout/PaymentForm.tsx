'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { View, Text, Button, Divider } from 'reshaped';
import { usePrivy } from '@privy-io/react-auth';

interface PaymentFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '14px',
      fontFamily: 'inherit',
      color: '#333',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#e22c2c',
    },
  },
};

const fieldWrapperStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '1px solid var(--rs-color-border-neutral-faded)',
  borderRadius: '8px',
  backgroundColor: '#fff',
};

export function PaymentForm({ clientSecret, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = usePrivy();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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
        setIsProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        setIsComplete(true);
        onSuccess(paymentIntent.id);
      }
    } catch (err) {
      onError('An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <View direction="column" gap={4}>
        <Text variant="body-1" weight="bold" attributes={{ style: { textTransform: 'uppercase', letterSpacing: '1px', fontSize: '12px' } }}>
          Payment Information
        </Text>
        <Divider />

        <View direction="column" gap={3}>
          <View direction="column" gap={1}>
            <Text variant="body-2" weight="medium">Card Number</Text>
            <div style={fieldWrapperStyle}>
              <CardNumberElement options={cardElementOptions} />
            </div>
          </View>

          <View direction="row" gap={3}>
            <View direction="column" gap={1} grow>
              <Text variant="body-2" weight="medium">Expiry Date</Text>
              <div style={fieldWrapperStyle}>
                <CardExpiryElement options={cardElementOptions} />
              </div>
            </View>

            <View direction="column" gap={1} grow>
              <Text variant="body-2" weight="medium">CVC</Text>
              <div style={fieldWrapperStyle}>
                <CardCvcElement options={cardElementOptions} />
              </div>
            </View>
          </View>
        </View>

        <Button
          type="submit"
          variant="solid"
          color="primary"
          size="large"
          fullWidth
          disabled={!stripe || isProcessing || isComplete}
        >
          {isComplete ? 'Order placed! Redirecting...' : isProcessing ? 'Processing...' : 'Complete Purchase'}
        </Button>
      </View>
    </form>
  );
}
