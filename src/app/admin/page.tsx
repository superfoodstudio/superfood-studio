'use client';

import { View, Text, Card, Grid, Button } from 'reshaped';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const { authenticated } = usePrivy();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is an admin
    async function checkUserRole() {
      try {
        const response = await fetch('/api/user/role');
        if (!response.ok) {
          throw new Error('Failed to fetch user role');
        }
        
        const data = await response.json();
        setUserRole(data.role);
      } catch (error) {
        console.error('Error checking user role:', error);
      } finally {
        setLoading(false);
      }
    }

    if (authenticated) {
      checkUserRole();
    } else {
      setLoading(false);
    }
  }, [authenticated, router]);

  // Redirect or show loading while checking authentication
  if (loading) {
    return (
      <View direction="column" align="center" justify="center" height="100vh">
        <Text>Loading...</Text>
      </View>
    );
  }

  // Redirect if not authenticated or not admin
  if (!authenticated || userRole !== 'ADMIN') {
    return (
      <View direction="column" align="center" justify="center" height="100vh" gap={4}>
        <Text variant="title-3">Access Denied</Text>
        <Text>You must be an admin to access this page.</Text>
        <Link href="/" passHref>
          <Button>Go to Home</Button>
        </Link>
      </View>
    );
  }

  // Admin dashboard UI
  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
      <View direction="column" gap={6} padding={8}>
        <Text variant="title-2">Admin Dashboard</Text>
        
        <Grid columns={{ s: "1fr", m: "1fr", l: "1fr 1fr" }} gap={4}>
          {/* Recipes Management Card */}
          <Card padding={6}>
            <View direction="column" gap={4}>
              <Text variant="title-3">Recipes</Text>
              <Text>Manage all recipes including creation, editing, and publishing.</Text>
              <View direction="row" justify="end">
                <Link href="/admin/recipes" passHref>
                  <Button>Manage Recipes</Button>
                </Link>
              </View>
            </View>
          </Card>
          
          {/* Products Management Card */}
          <Card padding={6}>
            <View direction="column" gap={4}>
              <Text variant="title-3">Products</Text>
              <Text>Manage all products with Stripe integration for e-commerce.</Text>
              <View direction="row" justify="end">
                <Link href="/admin/products" passHref>
                  <Button>Manage Products</Button>
                </Link>
              </View>
            </View>
          </Card>
          
          {/* Subscription Management Card (Future) */}
          <Card padding={6}>
            <View direction="column" gap={4}>
              <Text variant="title-3">Subscriptions</Text>
              <Text>Manage subscription plans and member access.</Text>
              <View direction="row" justify="end">
                <Button variant="outline" disabled>Coming Soon</Button>
              </View>
            </View>
          </Card>
          
          {/* Orders Management Card (Future) */}
          <Card padding={6}>
            <View direction="column" gap={4}>
              <Text variant="title-3">Orders</Text>
              <Text>View and manage customer orders and shipping.</Text>
              <View direction="row" justify="end">
                <Button variant="outline" disabled>Coming Soon</Button>
              </View>
            </View>
          </Card>
        </Grid>
      </View>
    </div>
  );
} 