'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { Button, View, Text, Card } from 'reshaped';
import { LoadMore } from '@/components/ui/LoadMore';
import { graphql } from 'relay-runtime';
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

// Define the query that includes the fragment
const AdminOrdersPageQuery = graphql`
  query pageOrdersPageQuery($first: Int!, $after: String, $status: String) {
    ...pageOrdersPaginationFragment
  }
`;

// Define the pagination fragment
const AdminOrdersPaginationFragment = graphql`
  fragment pageOrdersPaginationFragment on Query
  @refetchable(queryName: "AdminOrdersPaginationQuery") {
    adminOrdersConnection(first: $first, after: $after, status: $status)
    @connection(key: "AdminOrdersList_adminOrdersConnection") {
      edges {
        cursor
        node {
          id
          customerName
          customerEmail
          total
          status
          date
          items {
            id
            productName
            quantity
            price
            photoUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

import type { pageOrdersPageQuery } from '@/__generated__/pageOrdersPageQuery.graphql';
import type { pageOrdersPaginationFragment$key } from '@/__generated__/pageOrdersPaginationFragment.graphql';

function AdminOrdersContent() {
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const queryData = useLazyLoadQuery<pageOrdersPageQuery>(
    AdminOrdersPageQuery,
    {
      first: 20,
      after: null,
      status: statusFilter,
    }
  );

  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<pageOrdersPageQuery, pageOrdersPaginationFragment$key>(
    AdminOrdersPaginationFragment, 
    queryData
  );

  const orders = data.adminOrdersConnection?.edges?.map(edge => edge.node) || [];
  
  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(20);
    }
  }, [loadNext, isLoadingNext, hasNext]);
  
  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
  };

  return (
    <View direction="column" gap={4}>
      {/* Status Filter */}
      <View direction="row" gap={2} align="center">
        <Text>Filter by status:</Text>
        <Button
          variant={statusFilter === null ? 'solid' : 'outline'}
          size="small"
          onClick={() => handleStatusFilter(null)}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'PENDING' ? 'solid' : 'outline'}
          size="small"
          onClick={() => handleStatusFilter('PENDING')}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === 'PROCESSING' ? 'solid' : 'outline'}
          size="small"
          onClick={() => handleStatusFilter('PROCESSING')}
        >
          Processing
        </Button>
        <Button
          variant={statusFilter === 'DELIVERED' ? 'solid' : 'outline'}
          size="small"
          onClick={() => handleStatusFilter('DELIVERED')}
        >
          Delivered
        </Button>
        <Button
          variant={statusFilter === 'CANCELED' ? 'solid' : 'outline'}
          size="small"
          onClick={() => handleStatusFilter('CANCELED')}
        >
          Canceled
        </Button>
      </View>

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
      {orders.length === 0 ? (
        <View direction="column" align="center" justify="center" height="300px">
          <Text>No orders found.</Text>
        </View>
      ) : (
        <>
          {orders.map((order) => (
            <View 
              key={order.id} 
              direction="row"
              padding={2}
              attributes={{ style: { borderBottom: '1px solid #eaeaea' }}}
            >
              <View width="14.28%">
                <Text weight="medium">{order.id.slice(-8).toUpperCase()}</Text>
              </View>
              <View width="14.28%" direction="column" gap={1}>
                <Text>{order.customerName}</Text>
                <Text variant="caption-1" color="neutral-faded">{order.customerEmail}</Text>
              </View>
              <View width="14.28%">
                <Text>{formatDate(order.date)}</Text>
              </View>
              <View width="14.28%">
                <Text>{order.items?.length || 0}</Text>
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
          
          <LoadMore
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
            onLoadMore={handleLoadMore}
          />
        </>
      )}
    </View>
  );
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <View direction="column" align="center" justify="center" height="300px">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View direction="column" gap={6} padding={8}>
      <View direction="column" gap={4}>
        <Text variant="title-2">Orders</Text>
        <Text>Manage customer orders and update their status.</Text>
      </View>
      
      <Card padding={6}>
        <Suspense fallback={
          <View direction="column" align="center" justify="center" height="300px">
            <Text>Loading orders...</Text>
          </View>
        }>
          <AdminOrdersContent />
        </Suspense>
      </Card>
    </View>
  );
} 