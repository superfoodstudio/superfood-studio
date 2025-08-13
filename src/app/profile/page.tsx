'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { View, Text } from 'reshaped';

export default function ProfilePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready) {
      if (authenticated) {
        // Redirect authenticated users to dashboard
        router.push('/dashboard/membership');
      } else {
        // Redirect unauthenticated users to home
        router.push('/');
      }
    }
  }, [ready, authenticated, router]);

  // Show loading while redirecting
  return (
    <View
      direction="column"
      align="center"
      justify="center"
      height="100vh"
    >
      <Text>Redirecting to dashboard...</Text>
    </View>
  );
}
