'use client';

import { Suspense } from 'react';
import { useLazyLoadQuery } from 'react-relay';
import { Text, View, Skeleton } from 'reshaped';
import { UserOrderQuery } from './OrderQueries';
import type { OrderQueries_UserOrderQuery } from '@/__generated__/OrderQueries_UserOrderQuery.graphql';
import Image from 'next/image';
import { ipfsUrl } from '@/lib/ipfs';

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

  const order = data.userOrder;

  if (!order) {
    return (
      <View direction="column" padding={6}>
        <View
          direction="column"
          gap={4}
          width="100%"
          attributes={{ style: { maxWidth: '500px', margin: '0 auto' } }}
        >
          <Text variant="featured-2" weight="bold">Order Not Found</Text>
          <Text variant="body-2" color="neutral-faded">
            The order you're looking for could not be found.
          </Text>
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
    <View direction="column" padding={6}>
      <View
        direction="column"
        gap={6}
        width="100%"
        attributes={{ style: { maxWidth: '500px', margin: '0 auto' } }}
      >
        {/* Order Header */}
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
          ORDER #{order.id.slice(-8).toUpperCase()}
        </Text>

        {/* Order Summary */}
        <View
          direction="column"
          gap={3}
          padding={4}
          attributes={{
            style: {
              border: '1px solid #e0ddd8',
              borderRadius: '4px',
            }
          }}
        >
          <Text variant="caption-1" color="neutral-faded">Order Summary</Text>
          <View direction="row" justify="space-between">
            <Text variant="caption-1" color="neutral-faded">Order Date</Text>
            <Text variant="body-2" weight="bold">{formatDate(order.createdAt)}</Text>
          </View>
          <View direction="row" justify="space-between">
            <Text variant="caption-1" color="neutral-faded">Status</Text>
            <Text
              variant="body-2"
              weight="bold"
              attributes={{
                style: {
                  color: order.status === 'COMPLETED' ? '#6b4c7a' : undefined
                }
              }}
            >
              {order.status.toLowerCase()}
            </Text>
          </View>
          <View direction="row" justify="space-between">
            <Text variant="caption-1" color="neutral-faded">Total</Text>
            <Text variant="body-2" weight="bold">{formatPrice(order.total)}</Text>
          </View>
        </View>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <View
            direction="column"
            gap={2}
            padding={4}
            attributes={{
              style: {
                border: '1px solid #e0ddd8',
                borderRadius: '4px',
              }
            }}
          >
            <Text variant="caption-1" color="neutral-faded">Shipping Address</Text>
            <View direction="column" gap={0}>
              <Text variant="body-2" weight="bold">
                {order.shippingAddress.street}
              </Text>
              <Text variant="body-2" color="neutral-faded">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Text>
              <Text variant="body-2" color="neutral-faded">
                {order.shippingAddress.country}
              </Text>
            </View>
          </View>
        )}

        {/* Items */}
        <View
          direction="column"
          attributes={{
            style: {
              border: '1px solid #e0ddd8',
              borderRadius: '4px',
            }
          }}
        >
          <View padding={4} attributes={{ style: { borderBottom: '1px solid #e0ddd8' } }}>
            <Text variant="caption-1" color="neutral-faded">Items Ordered</Text>
          </View>

          {order.items.map((item, index) => (
            <View
              key={item.id}
              direction="row"
              gap={3}
              padding={4}
              align="center"
              attributes={{
                style: {
                  borderBottom: index < order.items.length - 1 ? '1px solid #e0ddd8' : 'none',
                }
              }}
            >
              <View
                attributes={{
                  style: {
                    width: '50px',
                    height: '50px',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }
                }}
              >
                <Image
                  src={ipfsUrl(item.product.photoUrl)}
                  alt={item.product.name}
                  width={50}
                  height={50}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
              </View>
              <View direction="column" gap={0} attributes={{ style: { flex: 1 } }}>
                <Text variant="body-2" weight="medium">{item.product.name}</Text>
                <Text variant="caption-1" color="neutral-faded">
                  {formatPrice(item.product.price)} * {item.quantity}
                </Text>
              </View>
              <Text variant="body-2" weight="bold">
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}
        </View>
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
        <Skeleton height="0.85rem" width="180px" borderRadius="small" />
        <View
          direction="column"
          gap={3}
          padding={4}
          attributes={{
            style: {
              border: '1px solid #e0ddd8',
              borderRadius: '4px',
            }
          }}
        >
          {[...Array(3)].map((_, i) => (
            <View key={i} direction="row" justify="space-between">
              <Skeleton height="0.75rem" width="80px" borderRadius="small" />
              <Skeleton height="0.75rem" width="100px" borderRadius="small" />
            </View>
          ))}
        </View>
        <View
          direction="column"
          attributes={{
            style: {
              border: '1px solid #e0ddd8',
              borderRadius: '4px',
            }
          }}
        >
          {[...Array(2)].map((_, i) => (
            <View
              key={i}
              direction="row"
              gap={3}
              padding={4}
              align="center"
              attributes={{
                style: {
                  borderBottom: i < 1 ? '1px solid #e0ddd8' : 'none',
                }
              }}
            >
              <Skeleton height="50px" width="50px" borderRadius="small" />
              <View direction="column" gap={1} attributes={{ style: { flex: 1 } }}>
                <Skeleton height="0.75rem" width="120px" borderRadius="small" />
                <Skeleton height="0.6rem" width="80px" borderRadius="small" />
              </View>
              <Skeleton height="0.75rem" width="50px" borderRadius="small" />
            </View>
          ))}
        </View>
      </View>
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
