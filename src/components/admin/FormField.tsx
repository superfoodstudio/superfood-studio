'use client';

import { View, Text } from 'reshaped';
import { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
}

export function FormField({ label, required = false, children, error }: FormFieldProps) {
  return (
    <View gap={2} width="100%">
      <Text>
        {label} {required && <Text as="span" color="critical">*</Text>}
      </Text>
      
      {children}
      
      {error && (
        <Text color="critical" variant="body-3">{error}</Text>
      )}
    </View>
  );
} 