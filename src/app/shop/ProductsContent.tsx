'use client';

import { Suspense } from 'react';
import ProductList from './ProductList';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Grid } from 'reshaped';

export default function ProductsContent() {
  return <ProductList />;
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