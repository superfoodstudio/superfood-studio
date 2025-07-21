'use client';

import { View, Text } from 'reshaped';

interface FormErrorProps {
  error: string | null;
}

export function FormError({ error }: FormErrorProps) {
  if (!error) return null;
  
  return (
    <View 
      backgroundColor="critical-faded" 
      padding={4} 
      borderRadius="medium" 
      attributes={{
        style: {
          marginBottom: '16px'
        }
      }}
    >
      <Text color="critical">{error}</Text>
    </View>
  );
} 