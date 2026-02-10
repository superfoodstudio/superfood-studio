'use client';

import { View, Text, Button } from 'reshaped';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <View direction="column" align="center" justify="center" padding={10} gap={4} attributes={{ style: { minHeight: '50vh' } }}>
      <Text variant="featured-1" weight="bold">Something went wrong</Text>
      <Text variant="body-1" color="neutral-faded">
        An unexpected error occurred. Please try again.
      </Text>
      <Button variant="solid" color="primary" onClick={reset}>
        Try Again
      </Button>
    </View>
  );
}
