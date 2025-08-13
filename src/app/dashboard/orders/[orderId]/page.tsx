'use client';

import { Suspense } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { Button, Text, View, Card } from 'reshaped';
import { UserOrderQuery } from './OrderQueries';
import type { OrderQueries_UserOrderQuery } from '@/__generated__/OrderQueries_UserOrderQuery.graphql';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

function OrderDetailContent({ orderId }: { orderId: string }) {
  const data = useLazyLoadQuery<OrderQueries_UserOrderQuery>(
    UserOrderQuery,
    { orderId }
  );
  const router = useRouter();

  const order = data.userOrder;

  if (!order) {
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
            <Button
              onClick={() => router.push('/dashboard/orders')}
              attributes={{
                style: {
                  marginBottom: '20px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#6b4c7a',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  padding: '0'
                }
              }}
            >
              ← Back to Orders
            </Button>
            <Text
              attributes={{
                style: {
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#4a4a4a',
                  marginBottom: '10px'
                }
              }}
            >
              Order Not Found
            </Text>
            <Text
              attributes={{
                style: {
                  fontSize: '13px',
                  color: '#8a8a8a'
                }
              }}
            >
              The order you're looking for could not be found.
            </Text>
          </Card>
        </View>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
          <Button
            onClick={() => router.push('/dashboard/orders')}
            attributes={{
              style: {
                marginBottom: '20px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#6b4c7a',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                padding: '0'
              }
            }}
          >
            ← Back to Orders
          </Button>

          {/* Order Header */}
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
            ORDER #{order.id.slice(-8).toUpperCase()}
          </Text>

          {/* Order Summary */}
          <View
            direction="column"
            gap={4}
            attributes={{
              style: {
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#faf9f7',
                border: '1px solid #e0ddd8',
                borderRadius: '2px'
              }
            }}
          >
            <Text
              attributes={{
                style: {
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#4a4a4a',
                  marginBottom: '15px'
                }
              }}
            >
              Order Summary
            </Text>
            <View direction="row" justify="space-between">
              <Text
                attributes={{
                  style: {
                    fontSize: '12px',
                    color: '#8a8a8a'
                  }
                }}
              >
                Order Date:
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: '12px',
                    color: '#4a4a4a'
                  }
                }}
              >
                {formatDate(order.createdAt)}
              </Text>
            </View>
            <View direction="row" justify="space-between">
              <Text
                attributes={{
                  style: {
                    fontSize: '12px',
                    color: '#8a8a8a'
                  }
                }}
              >
                Status:
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: '12px',
                    color: order.status === 'COMPLETED' ? '#6b4c7a' : '#4a4a4a',
                    fontWeight: '500'
                  }
                }}
              >
                {order.status.toLowerCase()}
              </Text>
            </View>
            <View direction="row" justify="space-between">
              <Text
                attributes={{
                  style: {
                    fontSize: '12px',
                    color: '#8a8a8a'
                  }
                }}
              >
                Total:
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: '13px',
                    color: '#4a4a4a',
                    fontWeight: '600'
                  }
                }}
              >
                {formatPrice(order.total)}
              </Text>
            </View>
          </View>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <View
              direction="column"
              gap={4}
              attributes={{
                style: {
                  marginBottom: '30px',
                  padding: '20px',
                  backgroundColor: '#faf9f7',
                  border: '1px solid #e0ddd8',
                  borderRadius: '2px'
                }
              }}
            >
              <Text
                attributes={{
                  style: {
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#4a4a4a',
                    marginBottom: '15px'
                  }
                }}
              >
                Shipping Address
              </Text>
              <View direction="column" gap={1}>
                <Text
                  attributes={{
                    style: {
                      fontSize: '12px',
                      color: '#4a4a4a',
                      fontWeight: '500'
                    }
                  }}
                >
                  {order.shippingAddress.street}
                </Text>
                <Text
                  attributes={{
                    style: {
                      fontSize: '12px',
                      color: '#8a8a8a'
                    }
                  }}
                >
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </Text>
                <Text
                  attributes={{
                    style: {
                      fontSize: '12px',
                      color: '#8a8a8a'
                    }
                  }}
                >
                  {order.shippingAddress.country}
                </Text>
              </View>
            </View>
          )}

          {/* Items */}
          <Text
            attributes={{
              style: {
                fontSize: '13px',
                fontWeight: '600',
                color: '#4a4a4a',
                marginBottom: '20px'
              }
            }}
          >
            Items Ordered
          </Text>

          <View direction="column" gap={4}>
            {order.items.map((item, index) => (
              <View
                key={item.id}
                direction="row"
                gap={3}
                attributes={{
                  style: {
                    padding: '15px 0',
                    borderBottom: index < order.items.length - 1 ? '1px solid #e0ddd8' : 'none',
                    alignItems: 'center'
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
                    src={item.product.photoUrl}
                    alt={item.product.name}
                    width={60}
                    height={60}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                </View>
                <View
                  direction="column"
                  gap={1}
                  attributes={{
                    style: {
                      flex: 1
                    }
                  }}
                >
                  <Text
                    attributes={{
                      style: {
                        fontSize: '13px',
                        fontWeight: '500',
                        color: '#4a4a4a'
                      }
                    }}
                  >
                    {item.product.name}
                  </Text>
                  <Text
                    attributes={{
                      style: {
                        fontSize: '11px',
                        color: '#8a8a8a'
                      }
                    }}
                  >
                    {item.product.category}
                  </Text>
                  <Text
                    attributes={{
                      style: {
                        fontSize: '11px',
                        color: '#8a8a8a'
                      }
                    }}
                  >
                    {formatPrice(item.product.price)} each × {item.quantity}
                  </Text>
                </View>
                <Text
                  attributes={{
                    style: {
                      fontSize: '13px',
                      fontWeight: '500',
                      color: '#4a4a4a'
                    }
                  }}
                >
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

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
              onClick={() => router.push('/dashboard/orders')}
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
              BACK TO ORDERS
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
      <Text>Loading order details...</Text>
    </View>
  );
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <OrderDetailContent orderId={params.orderId} />
    </Suspense>
  );
}
