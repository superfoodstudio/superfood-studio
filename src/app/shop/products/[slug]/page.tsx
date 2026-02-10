'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { View, Text, Button, Divider } from 'reshaped';
import { useLazyLoadQuery, useFragment } from 'react-relay';
import { ProductDetailBySlugQuery, ProductDetailFragment } from '@/graphql/queries/ProductQueries';
import type { 
  ProductQueriesProductDetailBySlugQuery
} from '@/__generated__/ProductQueriesProductDetailBySlugQuery.graphql';
import type {
  ProductQueriesProductDetail_product$key,
  ProductQueriesProductDetail_product$data
} from '@/__generated__/ProductQueriesProductDetail_product.graphql';
import { useEffect } from 'react';
import { AppContainer } from '@/components/layout/AppContainer';
import { useParams, useRouter } from 'next/navigation';
import { StarRating } from '@/components/ratings/StarRating';
import { ProductDetailSkeleton } from '@/components/ui/ProductDetailSkeleton';
import { RichTextDisplay } from '@/components/ui/RichTextDisplay';
import { useCart } from '@/hooks/useCart';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ShoppingCartSimple } from 'phosphor-react';
import { ipfsUrl } from '@/lib/ipfs';

// LazyLoad component that will only fetch data when it's needed
function ProductDetailLazy({ slug }: { slug: string }) {
  const data = useLazyLoadQuery<ProductQueriesProductDetailBySlugQuery>(
    ProductDetailBySlugQuery,
    { slug },
    { fetchPolicy: 'store-or-network' } // Use cache if available, otherwise fetch
  );
  
  if (data.productBySlug) {
    return <ProductDetailView productRef={data.productBySlug} />;
  }
  
  return <ProductNotFound />;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productSlug = params.slug as string;
  const [isReady, setIsReady] = useState(false);
  
  // Delay query execution until component is mounted
  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <AppContainer maxWidth={750}>
      <Suspense fallback={<ProductDetailSkeleton />}>
        {isReady && <ProductDetailLazy slug={productSlug} />}
      </Suspense>
    </AppContainer>
  );
}

function ProductNotFound() {
  return (
    <View direction="column" align="center" gap={4} padding={8}>
      <Text variant="featured-1">Product not found</Text>
      <Link href="/shop"><Button variant="solid">Back to Shop</Button></Link>
    </View>
  );
}

type ProductDetailViewProps = {
  productRef: ProductQueriesProductDetail_product$key;
};

function ProductDetailView({ productRef }: ProductDetailViewProps) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();
  
  // Use the fragment to access product data with type safety
  const product: ProductQueriesProductDetail_product$data = useFragment(
    ProductDetailFragment,
    productRef
  );
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const handleAddToCart = () => {
    if (isAdding || product.inventory <= 0) {
      return;
    }
    
    setIsAdding(true);
    
    try {
      addToCart(product.id, 1, product.price, {
        name: product.name,
        photoUrl: product.photoUrl
      });
    } catch (error) {
      // Cart add failed
    } finally {
      setIsAdding(false);
    }
  };
  
  return (
    <View direction="column" gap={6}>
      <Button
        variant="ghost"
        onClick={() => router.back()}
        attributes={{ style: { alignSelf: 'flex-start' } }}
      >
        ← Back
      </Button>

      {/* Product Image - centered */}
      <View align="center">
        <img
          src={ipfsUrl(product.photoUrl)}
          alt={product.name}
          style={{
            width: '100%',
            maxWidth: '500px',
            height: 'auto',
            maxHeight: '400px',
            objectFit: 'cover',
            borderRadius: '8px',
          }}
        />
      </View>

      {/* Category tag */}
      <View
        attributes={{
          style: {
            display: 'inline-block',
            border: '1px solid var(--rs-color-border-neutral-faded)',
            alignSelf: 'flex-start',
            borderRadius: '4px',
            padding: '4px 8px',
          }
        }}
      >
        <Text variant="caption-1">
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </Text>
      </View>

      {/* Title, Price, Rating */}
      <View direction="column" gap={2}>
        <Text variant="featured-1" weight="bold">{product.name}</Text>
        <Text variant="body-1">{formatPrice(product.price)}</Text>
        <StarRating
          itemId={product.id}
          itemType="product"
          averageRating={product.averageRating || 0}
          totalRatings={product.totalRatings}
          size="large"
        />
      </View>

      <Divider />

      {/* Description - matching recipe body style */}
      <View paddingInline={{ s: 0, m: 16 }} paddingBlock={{ s: 2, m: 8 }}>
        <Text variant="body-1" attributes={{ style: { fontFamily: 'Habibi, serif' } }}>
          <RichTextDisplay content={product.description} />
        </Text>
      </View>

      {/* Tags */}
      <View direction="row" gap={2} wrap>
        {product.tags.map((tag: string) => (
          <View
            key={tag}
            backgroundColor="neutral-faded"
            attributes={{
              style: {
                padding: '4px 12px',
                borderRadius: '4px'
              }
            }}
          >
            <Text variant="body-3">{tag}</Text>
          </View>
        ))}
      </View>

      {/* Add to Cart / Quantity - bottom right */}
      <View direction="column" gap={2} align="end" paddingBottom={10}>
        {(() => {
          const cartItem = cart?.items.find(item => item.productId === product.id);
          if (cartItem) {
            return (
              <QuantitySelector
                quantity={cartItem.quantity}
                onIncrease={() => updateQuantity(product.id, cartItem.quantity + 1)}
                onDecrease={() => {
                  if (cartItem.quantity === 1) {
                    removeFromCart(product.id);
                  } else {
                    updateQuantity(product.id, cartItem.quantity - 1);
                  }
                }}
                disabled={isAdding}
                size="medium"
              />
            );
          }
          return (
            <Button
              variant="solid"
              size="large"
              color="primary"
              disabled={isAdding || product.inventory <= 0}
              onClick={handleAddToCart}
            >
              <View direction="row" gap={2} align="center">
                <ShoppingCartSimple size={20} />
                <Text>{isAdding ? 'Adding...' : 'Add to Cart'}</Text>
              </View>
            </Button>
          );
        })()}

        {product.inventory <= 10 && product.inventory > 0 && (
          <Text variant="body-2" color="critical">
            Only {product.inventory} left in stock!
          </Text>
        )}

        {product.inventory === 0 && (
          <Text variant="body-2" color="critical">
            Out of stock
          </Text>
        )}
      </View>

      {/* Product Video (if available) */}
      {product.videoUrl && (
        <View direction="column" gap={2} attributes={{ style: { marginTop: '2rem', marginBottom: '2rem' } }}>
          <Text variant="featured-1">Product Video</Text>
          <View
            attributes={{
              style: {
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%',
              }
            }}
          >
            <video
              src={ipfsUrl(product.videoUrl)}
              controls
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '8px',
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
} 