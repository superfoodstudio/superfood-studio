'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { Suspense, useEffect, useCallback } from 'react';
import { View, Text, Button, Skeleton } from 'reshaped';
import { UserOrdersQuery, UserOrdersPaginationFragment } from './OrderQueries';
import { LoadMore } from '@/components/ui/LoadMore';
import type { OrderQueriesUserOrdersQuery } from '@/__generated__/OrderQueriesUserOrdersQuery.graphql';
import type { OrderQueriesUserOrdersPaginationFragment$key } from '@/__generated__/OrderQueriesUserOrdersPaginationFragment.graphql';

function OrdersContent() {
  const queryData = useLazyLoadQuery<OrderQueriesUserOrdersQuery>(UserOrdersQuery, {
    first: 10
  });
  
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    OrderQueriesUserOrdersQuery,
    OrderQueriesUserOrdersPaginationFragment$key
  >(UserOrdersPaginationFragment, queryData);
  
  const router = useRouter();

  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(10);
    }
  }, [loadNext, isLoadingNext, hasNext]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <View
      direction="column"
      padding={6}
    >
      <View
        direction="column"
        gap={6}
        width="100%"
        attributes={{ style: { maxWidth: '500px', margin: '0 auto' } }}
      >
        {/* Section Title */}
        <Text
          attributes={{
            style: {
              color: '#8a8a8a',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
            }
          }}
        >
          ORDER HISTORY
        </Text>

        {!data.userOrders || data.userOrders.edges.length === 0 ? (
          <View
            direction="column"
            align="center"
            gap={4}
            padding={8}
            attributes={{
              style: {
                border: '1px solid #e0ddd8',
                borderRadius: '4px',
              }
            }}
          >
            <Text variant="body-2" color="neutral-faded">
              No orders yet
            </Text>
            <Button
              variant="solid"
              size="small"
              onClick={() => router.push('/shop')}
            >
              Start Shopping
            </Button>
          </View>
        ) : (
          <View
            direction="column"
            attributes={{
              style: {
                border: '1px solid #e0ddd8',
                borderRadius: '4px',
              }
            }}
          >
            {data.userOrders.edges.map(({ node: order }, index) => (
              <View
                key={order.id}
                direction="row"
                justify="space-between"
                padding={4}
                attributes={{
                  style: {
                    borderBottom: index < data.userOrders!.edges.length - 1 ? '1px solid #e0ddd8' : 'none',
                    alignItems: 'center'
                  }
                }}
              >
                <View direction="column" gap={1}>
                  <a
                    href={`/dashboard/orders/${order.id}`}
                    style={{
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#6b4c7a',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      textAlign: 'left'
                    }}
                  >
                    #{order.id.slice(-8).toUpperCase()}
                  </a>
                  <Text variant="caption-1" color="neutral-faded">
                    {formatDate(order.createdAt)} • {order.items.length} items
                  </Text>
                </View>
                <View direction="column" align="end" gap={1}>
                  <Text variant="body-2" weight="medium">
                    {formatPrice(order.total)}
                  </Text>
                  <Text
                    variant="caption-1"
                    attributes={{
                      style: {
                        color: order.status === 'COMPLETED' ? '#6b4c7a' : '#8a8a8a'
                      }
                    }}
                  >
                    {order.status.toLowerCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <LoadMore
          hasNext={hasNext}
          isLoadingNext={isLoadingNext}
          onLoadMore={handleLoadMore}
        />
      </View>
    </View>
  );
}

function LoadingFallback() {
  return (
    <View direction="column" padding={6}>
      <View
        direction="column"
        gap={6}
        width="100%"
        attributes={{ style: { maxWidth: '500px', margin: '0 auto' } }}
      >
        <Skeleton height="1rem" width="120px" />
        <View
          direction="column"
          gap={0}
          attributes={{
            style: {
              border: '1px solid #e0ddd8',
              borderRadius: '4px',
            }
          }}
        >
          {[...Array(3)].map((_, i) => (
            <View
              key={i}
              direction="row"
              justify="space-between"
              padding={4}
              attributes={{
                style: {
                  borderBottom: i < 2 ? '1px solid #e0ddd8' : 'none',
                }
              }}
            >
              <View direction="column" gap={2}>
                <Skeleton height="0.8rem" width="80px" />
                <Skeleton height="0.6rem" width="120px" />
              </View>
              <View direction="column" align="end" gap={2}>
                <Skeleton height="0.8rem" width="60px" />
                <Skeleton height="0.6rem" width="50px" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrdersContent />
    </Suspense>
  );
}
