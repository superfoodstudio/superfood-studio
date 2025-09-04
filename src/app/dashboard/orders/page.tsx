'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { Suspense, useEffect, useCallback } from 'react';
import { View, Text, Button, Card } from 'reshaped';
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
      gap={10}
      padding={10}
      attributes={{
        style: {
          minHeight: '100vh'
        }
      }}
    >
      <View
        maxWidth={600}
        direction="column"
        gap={10}
        width="100%"
        paddingTop={10}
        attributes={{ style: { margin: 'auto' } }}
      >
        <Card
          padding={8}
          attributes={{
            style: {
              backgroundColor: '#ffffff',
              border: '1px solid #e0ddd8',
              borderRadius: '2px'
            }
          }}
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
                marginBottom: '25px'
              }
            }}
          >
            ORDER HISTORY
          </Text>

          {!data.userOrders || data.userOrders.edges.length === 0 ? (
            <View direction="column" align="center" gap={4}>
              <Text
                attributes={{
                  style: {
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#4a4a4a',
                    textAlign: 'center'
                  }
                }}
              >
                no orders found
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: '12px',
                    fontWeight: '400',
                    color: '#8a8a8a',
                    textAlign: 'center'
                  }
                }}
              >
                start shopping to see your orders here
              </Text>
              <Button
                onClick={() => router.push('/')}
                attributes={{
                  style: {
                    width: '150px',
                    height: '35px',
                    backgroundColor: '#6b4c7a',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '500',
                    letterSpacing: '0.5px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    marginTop: '15px'
                  }
                }}
              >
                START SHOPPING
              </Button>
            </View>
          ) : (
            <View direction="column">
              {data.userOrders.edges.map(({ node: order }, index) => (
                <View key={order.id}>
                  {/* Order Row */}
                  <View
                    direction="row"
                    justify="space-between"
                    attributes={{
                      style: {
                        height: '50px',
                        padding: '15px 0',
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
                      <Text
                        attributes={{
                          style: {
                            fontSize: '11px',
                            fontWeight: '400',
                            color: '#8a8a8a'
                          }
                        }}
                      >
                        {formatDate(order.createdAt)} • {order.items.length} items
                      </Text>
                    </View>
                    <View direction="column" align="end" gap={1}>
                      <Text
                        attributes={{
                          style: {
                            fontSize: '13px',
                            fontWeight: '500',
                            color: '#4a4a4a'
                          }
                        }}
                      >
                        {formatPrice(order.total)}
                      </Text>
                      <Text
                        attributes={{
                          style: {
                            fontSize: '11px',
                            fontWeight: '400',
                            color: order.status === 'COMPLETED' ? '#6b4c7a' : '#8a8a8a'
                          }
                        }}
                      >
                        {order.status.toLowerCase()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Load More Component */}
          <LoadMore
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
            onLoadMore={handleLoadMore}
          />

          {/* Navigation Buttons */}
          <View
            direction="column"
            align="center"
            gap={4}
            attributes={{
              style: {
                marginTop: '40px'
              }
            }}
          >
            <Button
              onClick={() => router.push('/dashboard/membership')}
              attributes={{
                style: {
                  width: '200px',
                  height: '45px',
                  backgroundColor: '#6b4c7a',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  borderRadius: '25px',
                  cursor: 'pointer'
                }
              }}
            >
              MANAGE MEMBERSHIP
            </Button>

            <Button
              onClick={() => router.push('/')}
              attributes={{
                style: {
                  width: '200px',
                  height: '45px',
                  backgroundColor: 'transparent',
                  border: '1px solid #6b4c7a',
                  color: '#6b4c7a',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  borderRadius: '25px',
                  cursor: 'pointer'
                }
              }}
            >
              CONTINUE SHOPPING
            </Button>
          </View>
        </Card>
      </View>
    </View>
  );
}

function LoadingFallback() {
  return (
    <View
      direction="column"
      align="center"
      justify="center"
      height="100vh"
    >
      <Text>Loading orders...</Text>
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
