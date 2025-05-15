'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { View, Text, Card, Button, Grid, Divider } from 'reshaped';

// Mock order details for demonstration
const MOCK_ORDER_ITEMS = [
  {
    id: 'item_1',
    name: 'Superfood Smoothie Mix',
    quantity: 2,
    price: 19.99,
    photoUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800'
  },
  {
    id: 'item_2',
    name: 'Organic Chia Seeds',
    quantity: 1,
    price: 12.99,
    photoUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=800'
  },
  {
    id: 'item_3',
    name: 'Wellness Tea Collection',
    quantity: 1,
    price: 24.95,
    photoUrl: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?q=80&w=800'
  }
];

const MOCK_ORDER_MAP = {
  'ord_123456': {
    id: 'ord_123456',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    total: 125.99,
    status: 'PENDING',
    date: '2023-09-15T12:30:00Z',
    items: MOCK_ORDER_ITEMS.slice(0, 3),
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    }
  },
  'ord_123457': {
    id: 'ord_123457',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    total: 75.50,
    status: 'PROCESSING',
    date: '2023-09-14T10:15:00Z',
    items: MOCK_ORDER_ITEMS.slice(0, 2),
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'US'
    }
  },
  'ord_123458': {
    id: 'ord_123458',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    total: 210.25,
    status: 'DELIVERED',
    date: '2023-09-12T14:45:00Z',
    items: MOCK_ORDER_ITEMS,
    shippingAddress: {
      street: '789 Pine St',
      state: 'TX',
      city: 'Austin',
      zipCode: '73301',
      country: 'US'
    }
  },
  'ord_123459': {
    id: 'ord_123459',
    customerName: 'Emma Davis',
    customerEmail: 'emma@example.com',
    total: 45.99,
    status: 'CANCELED',
    date: '2023-09-10T09:20:00Z',
    items: MOCK_ORDER_ITEMS.slice(0, 1),
    shippingAddress: {
      street: '321 Elm St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60007',
      country: 'US'
    }
  }
};

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

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newStatus, setNewStatus] = useState<string>('');

  useEffect(() => {
    async function fetchOrderDetails() {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be a GraphQL query
        // For now, we'll simulate a delay and use the mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const orderDetails = MOCK_ORDER_MAP[orderId as keyof typeof MOCK_ORDER_MAP];
        setOrder(orderDetails || null);
        
        if (orderDetails) {
          setNewStatus(orderDetails.status);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  async function handleUpdateStatus() {
    if (!order || newStatus === order.status) return;
    
    try {
      // In a real implementation, this would be a GraphQL mutation
      // For now, we'll just simulate a delay and update the local state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOrder({
        ...order,
        status: newStatus
      });
      
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  }

  if (isLoading) {
    return (
      <View direction="column" align="center" justify="center" height="300px">
        <Text>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View direction="column" align="center" justify="center" height="300px" gap={4}>
        <Text variant="title-3">Order Not Found</Text>
        <Text>The requested order could not be found.</Text>
        <Link href="/admin/orders" passHref>
          <Button>Back to Orders</Button>
        </Link>
      </View>
    );
  }

  return (
    <View direction="column" gap={6} padding={8}>
      <View direction="row" justify="space-between" align="center">
        <View direction="column" gap={1}>
          <Text variant="title-2">Order #{order.id}</Text>
          <Text>{formatDate(order.date)}</Text>
        </View>
        
        <Link href="/admin/orders" passHref>
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </View>
      
      <Grid columns={{ s: "1fr", m: "1fr 1fr" }} gap={4}>
        <Card padding={6}>
          <View direction="column" gap={4}>
            <Text variant="title-3">Customer Information</Text>
            <Divider />
            
            <View direction="column" gap={2}>
              <View direction="row" justify="space-between">
                <Text>Name:</Text>
                <Text weight="medium">{order.customerName}</Text>
              </View>
              <View direction="row" justify="space-between">
                <Text>Email:</Text>
                <Text weight="medium">{order.customerEmail}</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card padding={6}>
          <View direction="column" gap={4}>
            <Text variant="title-3">Shipping Address</Text>
            <Divider />
            
            <View direction="column" gap={2}>
              <Text>{order.shippingAddress.street}</Text>
              <Text>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</Text>
              <Text>{order.shippingAddress.country}</Text>
            </View>
          </View>
        </Card>
        
        <Card padding={6} attributes={{ style: { gridColumn: "1 / -1" } }}>
          <View direction="column" gap={4}>
            <Text variant="title-3">Order Items</Text>
            <Divider />
            
            {order.items.map((item: any) => (
              <View 
                key={item.id} 
                direction="row" 
                align="center" 
                gap={4} 
                attributes={{ style: { borderBottom: '1px solid #eaeaea', paddingBottom: '16px' } }}
              >
                <img 
                  src={item.photoUrl} 
                  alt={item.name} 
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover', borderRadius: '4px' }} 
                />
                <View direction="column" gap={1} attributes={{ style: { flex: 1 } }}>
                  <Text weight="medium">{item.name}</Text>
                  <Text>{item.quantity} × ${item.price.toFixed(2)}</Text>
                </View>
                <Text weight="medium">${(item.quantity * item.price).toFixed(2)}</Text>
              </View>
            ))}
            
            <View direction="column" gap={2} attributes={{ style: { marginLeft: 'auto', minWidth: '150px' } }}>
              <View direction="row" justify="space-between">
                <Text>Subtotal:</Text>
                <Text>${order.total.toFixed(2)}</Text>
              </View>
              <View direction="row" justify="space-between">
                <Text>Shipping:</Text>
                <Text>$0.00</Text>
              </View>
              <View direction="row" justify="space-between">
                <Text weight="medium">Total:</Text>
                <Text weight="medium">${order.total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <Card padding={6} attributes={{ style: { gridColumn: "1 / -1" } }}>
          <View direction="column" gap={4}>
            <Text variant="title-3">Order Status</Text>
            <Divider />
            
            <View direction="row" justify="space-between" align="center">
              <View direction="column" gap={2}>
                <Text>Current Status:</Text>
                <Text 
                  attributes={{
                    style: {
                      padding: '6px 12px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      backgroundColor: 
                        order.status === 'PENDING' ? '#FEF3C7' :
                        order.status === 'PROCESSING' ? '#DBEAFE' :
                        order.status === 'DELIVERED' ? '#D1FAE5' : 
                        order.status === 'CANCELED' ? '#FEE2E2' : '#F3F4F6',
                      color:
                        order.status === 'PENDING' ? '#92400E' :
                        order.status === 'PROCESSING' ? '#1E40AF' :
                        order.status === 'DELIVERED' ? '#065F46' : 
                        order.status === 'CANCELED' ? '#B91C1C' : '#374151',
                    }
                  }}
                >
                  {order.status}
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
                  disabled={newStatus === order.status}
                  onClick={handleUpdateStatus}
                >
                  Update Status
                </Button>
              </View>
            </View>
          </View>
        </Card>
      </Grid>
    </View>
  );
} 