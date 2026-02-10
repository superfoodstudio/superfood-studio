'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { Button, View, Text, Table } from 'reshaped';
import { LoadMore } from '@/components/ui/LoadMore';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { graphql } from 'relay-runtime';

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Helper function to format price
function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
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
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Use STATIC default variables so filter changes don't trigger Suspense
  const queryData = useLazyLoadQuery<pageOrdersPageQuery>(
    AdminOrdersPageQuery,
    {
      first: 20,
      after: null,
      status: null,
    }
  );

  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
    refetch,
  } = usePaginationFragment<pageOrdersPageQuery, pageOrdersPaginationFragment$key>(
    AdminOrdersPaginationFragment,
    queryData
  );

  // Refetch when filter changes (does NOT trigger Suspense)
  useEffect(() => {
    refetch({
      first: 20,
      after: null,
      status: statusFilter,
    });
  }, [statusFilter, refetch]);

  const orders = data.adminOrdersConnection?.edges?.map(edge => edge.node) || [];

  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(20);
    }
  }, [loadNext, isLoadingNext, hasNext]);

  return (
    <View direction="column" gap={6}>
      <View direction="column" gap={1}>
        <Button variant="ghost" size="small" onClick={() => router.push('/admin')} attributes={{ style: { alignSelf: 'flex-start' } }}>
          ← Back
        </Button>
        <Text variant="body-1" weight="medium" attributes={{ style: { fontSize: '1.1rem' } }}>
          Orders
        </Text>
      </View>

      {/* Filters */}
      <View direction="row" gap={2} align="center" wrap>
        <Text variant="caption-1" color="neutral-faded">Status:</Text>
        {([null, 'PENDING', 'PROCESSING', 'DELIVERED', 'CANCELED'] as const).map((status) => (
          <Button
            key={status ?? 'all'}
            variant={statusFilter === status ? 'outline' : 'ghost'}
            size="small"
            onClick={() => setStatusFilter(status)}
          >
            {status === null ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
          </Button>
        ))}
      </View>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <View direction="column" align="center" justify="center" height="300px">
          <Text color="neutral-faded">No orders found.</Text>
        </View>
      ) : (
        <>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading>Order</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Customer</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Items</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Total</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Status</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Date</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {orders.map((order) => (
                <Table.Row
                  key={order.id}
                  attributes={{
                    style: { cursor: 'pointer' },
                    onClick: () => router.push(`/admin/orders/${order.id}`),
                  }}
                >
                  <Table.Cell>
                    <Text weight="medium">{order.id.slice(-8).toUpperCase()}</Text>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <View direction="column" gap={1}>
                      <Text variant="caption-1">{order.customerName}</Text>
                      <Text variant="caption-1" color="neutral-faded">{order.customerEmail}</Text>
                    </View>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1" color="neutral-faded">{order.items?.length || 0}</Text>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1">{formatPrice(order.total)}</Text>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1" color="neutral-faded">
                      {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                    </Text>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1" color="neutral-faded">{formatDate(order.date)}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

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

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
        <ListSkeleton rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      <Suspense fallback={<ListSkeleton rows={8} columns={6} />}>
        <AdminOrdersContent />
      </Suspense>
    </div>
  );
}
