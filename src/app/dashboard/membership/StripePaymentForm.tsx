'use client';

import { useLazyLoadQuery } from 'react-relay';
import { View, Text } from 'reshaped';
import { StripeWrapper } from '@/components/stripe/StripeWrapper';
import { PaymentMethodForm } from '@/components/stripe/PaymentMethodForm';
import { SetupIntentQuery } from './SetupIntentQuery';
import type { SetupIntentQueryQuery } from '@/__generated__/SetupIntentQueryQuery.graphql';

interface StripePaymentFormProps {
  selectedPlan: 'monthly' | 'yearly' | null;
  onSuccess: (paymentMethodId: string) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function StripePaymentForm({ 
  selectedPlan, 
  onSuccess, 
  onError, 
  onCancel 
}: StripePaymentFormProps) {
  const setupIntentData = useLazyLoadQuery<SetupIntentQueryQuery>(SetupIntentQuery, {});
  
  console.log('Setup intent data:', setupIntentData);
  
  if (!setupIntentData?.createSetupIntent?.clientSecret) {
    return (
      <View padding={4}>
        <Text color="critical">Failed to load payment form. Please try again.</Text>
      </View>
    );
  }

  const clientSecret = setupIntentData.createSetupIntent.clientSecret;

  return (
    <StripeWrapper clientSecret={clientSecret}>
      <PaymentMethodForm
        selectedPlan={selectedPlan}
        onSuccess={onSuccess}
        onError={onError}
        onCancel={onCancel}
      />
    </StripeWrapper>
  );
}