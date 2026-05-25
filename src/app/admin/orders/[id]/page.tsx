'use client';

export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { View, Text, Card, Button, Grid, Divider } from 'reshaped';
import { ContentSkeleton } from '@/components/ui/ListSkeleton';
import { useLazyLoadQuery } from 'react-relay';
import { AdminOrderQuery } from './AdminOrderQueries';
import type { AdminOrderQueries_AdminOrderQuery } from '@/__generated__/AdminOrderQueries_AdminOrderQuery.graphql';
import { ipfsUrl } from '@/lib/ipfs';

function AdminOrderContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const data = useLazyLoadQuery<AdminOrderQueries_AdminOrderQuery>(
    AdminOrderQuery,
    { orderId }
  );

  const [newStatus, setNewStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const order = data.adminOrder;

  // Set initial status when order loads
  React.useEffect(() => {
    if (order) {
      setNewStatus(order.status);
    }
  }, [order]);

  // Helper function to format date
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  async function handleUpdateStatus() {
    if (!order || newStatus === order.status) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
              updateOrderStatus(orderId: $orderId, status: $status) {
                id
                status
              }
            }
          `,
          variables: {
            orderId: order.id,
            status: newStatus,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || 'Error updating order status');
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  }

  if (!order) {
    return (
      <View direction="column" align="center" justify="center" height="300px" gap={4}>
        <Text variant="featured-1">Order Not Found</Text>
        <Text>The requested order could not be found.</Text>
        <Link href="/admin/orders" passHref>
          <Button>Back to Orders</Button>
        </Link>
      </View>
    );
  }

  const customerName = order.user 
    ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email
    : 'Unknown Customer';

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <View direction="column" gap={1}>
        <Button variant="ghost" size="small" onClick={() => router.push('/admin/orders')} attributes={{ style: { alignSelf: 'flex-start' } }}>
          ← Back
        </Button>
        <Text variant="body-1" weight="medium" attributes={{ style: { fontSize: '1.1rem' } }}>
          Order #{order.id.slice(-8).toUpperCase()}
        </Text>
      </View>
      
      <Grid columns={{ s: "1fr", m: "1fr 1fr" }} gap={4}>
        <Card padding={6}>
          <View direction="column" gap={4}>
            <Text variant="featured-1">Customer Information</Text>
            <Divider />
            
            <View direction="column" gap={2}>
              <View direction="row" justify="space-between">
                <Text>Name:</Text>
                <Text weight="medium">{customerName}</Text>
              </View>
              <View direction="row" justify="space-between">
                <Text>Email:</Text>
                <Text weight="medium">{order.user?.email || 'N/A'}</Text>
              </View>
              <View direction="row" justify="space-between">
                <Text>User ID:</Text>
                <Text weight="medium">{order.userId}</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card padding={6}>
          <View direction="column" gap={4}>
            <Text variant="featured-1">Order Information</Text>
            <Divider />
            
            <View direction="column" gap={2}>
              <View direction="row" justify="space-between">
                <Text>Order ID:</Text>
                <Text weight="medium">{order.id}</Text>
              </View>
              <View direction="row" justify="space-between">
                <Text>Created:</Text>
                <Text weight="medium">{formatDate(order.createdAt)}</Text>
              </View>
              <View direction="row" justify="space-between">
                <Text>Updated:</Text>
                <Text weight="medium">{formatDate(order.updatedAt)}</Text>
              </View>
              {order.stripeSessionId && (
                <View direction="row" justify="space-between">
                  <Text>Stripe Session:</Text>
                  <Text weight="medium">{order.stripeSessionId.slice(-8)}</Text>
                </View>
              )}
            </View>
          </View>
        </Card>
        
        {order.shippingAddress && (
          <Card padding={6} attributes={{ style: { gridColumn: "1 / -1" } }}>
            <View direction="column" gap={4}>
              <Text variant="featured-1">Shipping Address</Text>
              <Divider />
              
              <View direction="column" gap={2}>
                <Text weight="medium">{order.shippingAddress.street}</Text>
                <Text>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Text>
                <Text>{order.shippingAddress.country}</Text>
              </View>
            </View>
          </Card>
        )}
        
        <Card padding={6} attributes={{ style: { gridColumn: "1 / -1" } }}>
          <View direction="column" gap={4}>
            <Text variant="featured-1">Order Items</Text>
            <Divider />
            
            {order.items.map((item, index) => (
              <View 
                key={item.id} 
                direction="row" 
                align="center" 
                gap={4} 
                attributes={{ 
                  style: { 
                    borderBottom: index < order.items.length - 1 ? '1px solid #eaeaea' : 'none', 
                    paddingBottom: '16px',
                    marginBottom: index < order.items.length - 1 ? '16px' : '0'
                  } 
                }}
              >
                <View
                  attributes={{
                    style: {
                      width: '60px',
                      height: '60px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      flexShrink: 0
                    }
                  }}
                >
                  <Image
                    src={ipfsUrl(item.product.photoUrl)}
                    alt={item.product.name}
                    fill
                    sizes="60px"
                    style={{ objectFit: 'cover' }}
                  />
                </View>
                <View direction="column" gap={1} attributes={{ style: { flex: 1 } }}>
                  <Text weight="medium">{item.product.name}</Text>
                  <Text variant="caption-1" color="neutral-faded">{item.product.category}</Text>
                  <Text>{item.quantity} × {formatPrice(item.price)}</Text>
                </View>
                <Text weight="medium">{formatPrice(item.quantity * item.price)}</Text>
              </View>
            ))}
            
            <View direction="column" gap={2} align="end" attributes={{ style: { marginTop: '20px' } }}>
              <View direction="row" justify="space-between" attributes={{ style: { minWidth: '200px' } }}>
                <Text>Subtotal:</Text>
                <Text>{formatPrice(order.total)}</Text>
              </View>
              <View direction="row" justify="space-between" attributes={{ style: { minWidth: '200px' } }}>
                <Text>Shipping:</Text>
                <Text>$0.00</Text>
              </View>
              <Divider attributes={{ style: { width: '200px' } }} />
              <View direction="row" justify="space-between" attributes={{ style: { minWidth: '200px' } }}>
                <Text weight="medium">Total:</Text>
                <Text weight="medium">{formatPrice(order.total)}</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card padding={6} attributes={{ style: { gridColumn: "1 / -1" } }}>
          <View direction="column" gap={4}>
            <Text variant="featured-1">Order Status</Text>
            <Divider />
            
            <View direction="row" justify="space-between" align="center">
              <View direction="column" gap={2}>
                <Text>Current Status:</Text>
                <Text weight="medium">
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </Text>
              </View>
              
              <View direction="row" gap={2} align="center">
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#fff'
                  }}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELED">CANCELED</option>
                </select>
                
                <Button 
                  disabled={newStatus === order.status || isUpdating}
                  onClick={handleUpdateStatus}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </Button>
              </View>
            </View>
          </View>
        </Card>
      </Grid>
    </div>
  );
}

function LoadingFallback() {
  return (
    <ContentSkeleton />
  );
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  if (!orderId) {
    return (
      <View direction="column" align="center" justify="center" height="300px" gap={4}>
        <Text variant="featured-1">Invalid Order ID</Text>
        <Link href="/admin/orders" passHref>
          <Button>Back to Orders</Button>
        </Link>
      </View>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminOrderContent orderId={orderId} />
    </Suspense>
  );
}