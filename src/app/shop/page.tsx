'use client';

import { Suspense, useEffect } from 'react';
import { View, Text } from 'reshaped';
import { useQueryLoader } from 'react-relay';
import { ProductsQuery } from '@/graphql/queries/ProductQueries';
import { AppContainer } from '@/components/layout/AppContainer';
import ProductList from './ProductList';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Grid } from 'reshaped';

export default function ShopPage() {
  const [queryRef, loadQuery] = useQueryLoader(ProductsQuery);

  useEffect(() => {
    loadQuery({ 
      category: null,
      status: "active",
      search: null,
      sort: "newest"
    });
  }, [loadQuery]);

  return (
    <AppContainer>
      <View direction="column" gap={4}>
        <View direction="column" align="center" padding={4}>
          <Text variant="title-1" align="center">Our Products</Text>
          <Text variant="body-1" align="center">
            Discover our superfoods and health products
          </Text>
        </View>
        
        <Suspense fallback={<ProductListSkeleton />}>
          {queryRef && <ProductList queryRef={queryRef} />}
        </Suspense>
      </View>
    </AppContainer>
  );
}

function ProductListSkeleton() {
  return (
    <Grid columns={{ s: 1, m: 2, l: 3, xl: 4 }} gap={4}>
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
} 