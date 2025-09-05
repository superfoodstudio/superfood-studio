'use client';

import { Suspense } from 'react';
import { View, Text, Card, Button } from 'reshaped';
import { useLazyLoadQuery } from 'react-relay';
import { useRouter } from 'next/navigation';
import { FeaturedProductQuery } from '@/graphql/queries/FeaturedProductQuery';
import { stripHtml } from '@/lib/textUtils';
import type { FeaturedProductQueryQuery } from '@/__generated__/FeaturedProductQueryQuery.graphql';

function FeaturedProductContent() {
  const router = useRouter();

  const data = useLazyLoadQuery<FeaturedProductQueryQuery>(
    FeaturedProductQuery,
    {}
  );

  // Get the featured product
  const product = data.featuredProduct;

  if (!product) {
    return null;
  }

  return (
    <Card
      padding={0}
      attributes={{
        style: {
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer'
        }
      }}
      onClick={() => router.push(`/shop/products/${product.slug}`)}
    >
      <View direction="row" height="300px">
        {/* Product Image */}
        <View
          attributes={{
            style: {
              flex: '0 0 40%',
              position: 'relative'
            }
          }}
        >
          <img
            src={product.photoUrl}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </View>

        {/* Product Content */}
        <View
          direction="column"
          gap={3}
          padding={6}
          attributes={{
            style: {
              flex: 1,
              justifyContent: 'center'
            }
          }}
        >
          <View
            backgroundColor="primary-faded"
            attributes={{
              style: {
                display: 'inline-block',
                alignSelf: 'flex-start',
                borderRadius: '4px',
                padding: '4px 8px'
              }
            }}
          >
            <Text variant="caption-1" color="primary">
              {product.category.toUpperCase()}
            </Text>
          </View>

          <Text
            variant="title-3"
            attributes={{
              style: {
                lineHeight: '1.2'
              }
            }}
          >
            {product.name}
          </Text>

          <Text
            variant="body-2"
            color="neutral-faded"
            attributes={{
              style: {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }
            }}
          >
            {stripHtml(product.description, 150)}
          </Text>

          <View direction="row" justify="space-between" align="center">
            <Text variant="title-4">
              ${product.price.toFixed(2)}
            </Text>
            <Button
              variant="solid"
              size="small"
              attributes={{
                style: {
                  backgroundColor: '#6b4c7a',
                  borderRadius: '15px',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }
              }}
            >
              VIEW PRODUCT
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}

function FeaturedProductLoading() {
  return (
    <Card
      padding={6}
      attributes={{
        style: {
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          height: '200px'
        }
      }}
    >
      <View direction="column" align="center" justify="center" height="100%">
        <Text variant="body-2" color="neutral-faded">
          Loading featured product...
        </Text>
      </View>
    </Card>
  );
}

export function FeaturedProduct() {
  return (
    <Suspense fallback={<FeaturedProductLoading />}>
      <FeaturedProductContent />
    </Suspense>
  );
}