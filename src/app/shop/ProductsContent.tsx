'use client';

import { Suspense, useEffect } from 'react';
import { useQueryLoader } from 'react-relay';
import { ProductsQuery } from '@/graphql/queries/ProductQueries';
import ProductList from './ProductList';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Grid } from 'reshaped';

export default function ProductsContent() {
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
    <Suspense fallback={<ProductListSkeleton />}>
      {queryRef && <ProductList queryRef={queryRef} />}
    </Suspense>
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