'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, View, Text, Card } from 'reshaped';

// Mock order data - this would come from your GraphQL API in a real implementation
const MOCK_ORDERS = [
  {
    id: 'ord_123456',
    customerName: 'John Smith',
    customerEmail: 'john@example.com',
    total: 125.99,
    status: 'PENDING',
    date: '2023-09-15T12:30:00Z',
    items: 3
  },
  {
    id: 'ord_123457',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    total: 75.50,
    status: 'PROCESSING',
    date: '2023-09-14T10:15:00Z',
    items: 2
  },
  {
    id: 'ord_123458',
    customerName: 'Michael Brown',
    customerEmail: 'michael@example.com',
    total: 210.25,
    status: 'DELIVERED',
    date: '2023-09-12T14:45:00Z',
    items: 4
  },
  {
    id: 'ord_123459',
    customerName: 'Emma Davis',
    customerEmail: 'emma@example.com',
    total: 45.99,
    status: 'CANCELED',
    date: '2023-09-10T09:20:00Z',
    items: 1
  },
];

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

// Helper function to get status color
function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'amber';
    case 'PROCESSING':
      return 'blue';
    case 'DELIVERED':
      return 'green';
    case 'CANCELED':
      return 'red';
    default:
      return 'gray';
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<typeof MOCK_ORDERS>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      setIsLoading(true);
      
      try {
        // In a real implementation, this would be a GraphQL query to fetch orders
        // For now, we'll just simulate a delay and use the mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        setOrders(MOCK_ORDERS);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  return (
    <View direction="column" gap={6} padding={8}>
      <View direction="column" gap={4}>
        <Text variant="title-2">Orders</Text>
        <Text>Manage customer orders and update their status.</Text>
      </View>
      
      <Card padding={6}>
        {isLoading ? (
          <View direction="column" align="center" justify="center" height="300px">
            <Text>Loading orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View direction="column" align="center" justify="center" height="300px">
            <Text>No orders found.</Text>
          </View>
        ) : (
          <View direction="column" gap={4}>
            {/* Table Header */}
            <View 
              direction="row" 
              padding={2}
              attributes={{ style: { 
                borderBottom: '1px solid #eaeaea',
                fontWeight: 'bold'
              }}}
            >
              <View width="14.28%"><Text>Order ID</Text></View>
              <View width="14.28%"><Text>Customer</Text></View>
              <View width="14.28%"><Text>Date</Text></View>
              <View width="14.28%"><Text>Items</Text></View>
              <View width="14.28%"><Text>Total</Text></View>
              <View width="14.28%"><Text>Status</Text></View>
              <View width="14.28%"><Text>Actions</Text></View>
            </View>
            
            {/* Table Rows */}
            {orders.map((order) => (
              <View 
                key={order.id} 
                direction="row"
                padding={2}
                attributes={{ style: { borderBottom: '1px solid #eaeaea' }}}
              >
                <View width="14.28%">
                  <Text weight="medium">{order.id}</Text>
                </View>
                <View width="14.28%" direction="column" gap={1}>
                  <Text>{order.customerName}</Text>
                  <Text variant="caption-1" color="neutral-faded">{order.customerEmail}</Text>
                </View>
                <View width="14.28%">
                  <Text>{formatDate(order.date)}</Text>
                </View>
                <View width="14.28%">
                  <Text>{order.items}</Text>
                </View>
                <View width="14.28%">
                  <Text weight="medium">${order.total.toFixed(2)}</Text>
                </View>
                <View width="14.28%">
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    backgroundColor: getStatusColor(order.status) === 'amber' ? '#FEF3C7' :
                                    getStatusColor(order.status) === 'blue' ? '#DBEAFE' :
                                    getStatusColor(order.status) === 'green' ? '#D1FAE5' : 
                                    getStatusColor(order.status) === 'red' ? '#FEE2E2' : '#F3F4F6',
                    color: getStatusColor(order.status) === 'amber' ? '#92400E' :
                          getStatusColor(order.status) === 'blue' ? '#1E40AF' :
                          getStatusColor(order.status) === 'green' ? '#065F46' : 
                          getStatusColor(order.status) === 'red' ? '#B91C1C' : '#374151',
                  }}>
                    {order.status}
                  </span>
                </View>
                <View width="14.28%">
                  <Link href={`/admin/orders/${order.id}`} passHref>
                    <Button size="small">View Details</Button>
                  </Link>
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
} 