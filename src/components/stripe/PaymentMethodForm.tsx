'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { View, Text, Button } from 'reshaped';

interface PaymentMethodFormProps {
  onSuccess?: (paymentMethodId: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
  selectedPlan?: 'monthly' | 'yearly' | null;
}

export function PaymentMethodForm({ onSuccess, onError, onCancel, selectedPlan }: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // First, submit the elements form
      const { error: submitError } = await elements.submit();
      
      if (submitError) {
        setErrorMessage(submitError.message || 'An error occurred during submission');
        onError?.(submitError.message || 'An error occurred during submission');
        return;
      }

      // Then create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
        params: {
          type: 'card',
        },
      });

      if (error) {
        setErrorMessage(error.message || 'An error occurred');
        onError?.(error.message || 'An error occurred');
      } else if (paymentMethod) {
        onSuccess?.(paymentMethod.id);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setErrorMessage(message);
      onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <View direction="column" gap={4}>
        {/* Stripe Payment Element */}
        <View
          attributes={{
            style: {
              padding: '16px',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
            },
          }}
        >
          <PaymentElement
            options={{
              layout: 'tabs',
            }}
          />
        </View>

        {/* Error Message */}
        {errorMessage && (
          <View
            padding={3}
            attributes={{
              style: {
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
              },
            }}
          >
            <Text color="critical">{errorMessage}</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View direction="row" gap={3} justify="end">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!stripe || isLoading}
          >
{isLoading ? 'Processing...' : selectedPlan ? `Subscribe & Pay ${selectedPlan === 'monthly' ? '$10/mo' : '$95/yr'}` : 'Update Payment Method'}
          </Button>
        </View>
      </View>
    </form>
  );
}