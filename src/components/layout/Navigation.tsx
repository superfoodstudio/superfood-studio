'use client';

import { usePrivy } from '@privy-io/react-auth';
import { View, Button, Text } from 'reshaped';
import Link from 'next/link';
import { useEffect } from 'react';

export function Navigation() {
  const { login, authenticated, logout, ready, user, getAccessToken } = usePrivy();

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    // Get the access token
    getAccessToken().then(token => {
      if (!token) {
        console.error('No access token received');
        return;
      }

      // Call our auth callback endpoint
      fetch('/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Auth callback failed');
        }
        return response.json();
      })
      .then(data => console.log('Auth callback response:', data))
      .catch(error => console.error('Auth callback error:', error));
    });
  }, [ready, authenticated, user, getAccessToken]);

  return (
    <View
      as="nav"
      direction="row"
      align="center"
      justify="space-between"
      padding={4}
      backgroundColor="elevation-base"
    >
      <View direction="row" align="center" gap={4}>
        <Link href="/" passHref>
          <Text variant="featured-2" color="primary">
            Superfood Studio
          </Text>
        </Link>
        <Link href="/about" passHref>
          <Button variant="ghost">About</Button>
        </Link>
        <Link href="/shop" passHref>
          <Button variant="ghost">Shop</Button>
        </Link>
        {authenticated && (
          <Link href="/recipes" passHref>
            <Button variant="ghost">Recipes</Button>
          </Link>
        )}
      </View>

      <View direction="row" align="center" gap={2}>
        {authenticated ? (
          <>
            <Link href="/profile" passHref>
              <Button variant="ghost">Profile</Button>
            </Link>
            <Link href="/admin" passHref>
              <Button variant="ghost">Admin</Button>
            </Link>
            <Button variant="outline" onClick={() => logout()}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button variant="solid" onClick={() => login()}>
            Connect
          </Button>
        )}
      </View>
    </View>
  );
} 