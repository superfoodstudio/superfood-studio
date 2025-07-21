'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { HomeContent } from '@/components/home/HomeContent';
import { View, Text } from 'reshaped';

export default function Home() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && authenticated) {
      // TODO: Check if user has active subscription
      // For now, redirect all authenticated users to dashboard
      router.push('/dashboard');
    }
  }, [ready, authenticated, router]);

  // Show loading while checking authentication
  if (!ready) {
    return (
      <View 
        direction="column"
        align="center" 
        justify="center" 
        height="100vh"
        attributes={{ 
          style: { 
            backgroundColor: '#f5f3f0'
          } 
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  }

  // Show home content for unauthenticated users
  if (!authenticated) {
    return <HomeContent />;
  }

  // Show loading while redirecting authenticated users
  return (
    <View 
      direction="column"
      align="center" 
      justify="center" 
      height="100vh"
      attributes={{ 
        style: { 
          backgroundColor: '#f5f3f0'
        } 
      }}
    >
      <Text>Redirecting to dashboard...</Text>
    </View>
  );
}
