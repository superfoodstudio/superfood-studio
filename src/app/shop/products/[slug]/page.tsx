'use client';

import { Suspense, useState } from 'react';
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
    <AppContainer maxWidth={1000}>
      <Suspense fallback={<Text align="center">Loading product...</Text>}>
        {isReady && <ProductDetailLazy slug={productSlug} />}
      </Suspense>
    </AppContainer>
  );
}

function ProductNotFound() {
  const router = useRouter();
  return (
    <View direction="column" align="center" gap={4} padding={8}>
      <Text variant="title-2">Product not found</Text>
      <Button variant="solid" onClick={() => router.push('/shop')}>
        Back to Shop
      </Button>
    </View>
  );
}

type ProductDetailViewProps = {
  productRef: ProductQueriesProductDetail_product$key;
};

function ProductDetailView({ productRef }: ProductDetailViewProps) {
  const router = useRouter();
  
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
    // Will implement with Relay mutation
    alert('Added to cart!');
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
      
      <View 
        direction="column"
        attributes={{
          style: { 
            display: 'flex',
            flexDirection: 'row',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }
        }}
      >
        {/* Product Image */}
        <View 
          attributes={{
            style: {
              position: 'relative',
              width: '100%',
              maxWidth: '500px',
              height: '400px',
              alignSelf: 'flex-start'
            }
          }}
        >
          <img
            src={product.photoUrl}
            alt={product.name}
            style={{ 
              width: '100%',
              height: '100%',
              objectFit: 'cover', 
              borderRadius: '8px' 
            }}
          />
        </View>
        
        {/* Product Details */}
        <View direction="column" gap={4}>
          <View direction="column" gap={2}>
            <Text variant="title-1">{product.name}</Text>
            <Text variant="title-2">{formatPrice(product.price)}</Text>
            <Text variant="body-2" color="neutral-faded" align="start">
              Category: {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Text>
          </View>
          
          <Divider />
          
          <Text variant="body-1" align="start">{product.description}</Text>
          
          {/* Rating Section */}
          <View direction="column" gap={2}>
            <Text variant="title-3">Rate this product</Text>
            <StarRating
              itemId={product.id}
              itemType="product"
              averageRating={product.averageRating || 0}
              totalRatings={product.totalRatings}
              size="large"
            />
          </View>
          
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
          
          <View direction="column" gap={2}>
            <Button 
              variant="solid" 
              size="large"
              onClick={handleAddToCart}
              attributes={{ style: { width: '100%' } }}
            >
              Add to Cart
            </Button>
            
            {product.inventory <= 10 && product.inventory > 0 && (
              <Text variant="body-2" color="critical" align="center">
                Only {product.inventory} left in stock!
              </Text>
            )}
            
            {product.inventory === 0 && (
              <Text variant="body-2" color="critical" align="center">
                Out of stock
              </Text>
            )}
          </View>
        </View>
      </View>
      
      {/* Product Video (if available) */}
      {product.videoUrl && (
        <View direction="column" gap={2} attributes={{ style: { marginTop: '2rem', marginBottom: '2rem' } }}>
          <Text variant="title-3">Product Video</Text>
          <View
            attributes={{
              style: {
                position: 'relative',
                width: '100%',
                paddingBottom: '56.25%', // 16:9 aspect ratio
              }
            }}
          >
            <video
              src={product.videoUrl}
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