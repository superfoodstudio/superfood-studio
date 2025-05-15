'use client';

import { View, Grid } from 'reshaped';
import { usePreloadedQuery, PreloadedQuery } from 'react-relay';
import { ProductsQuery } from '@/graphql/queries/ProductQueries';
import { ProductCard } from '@/components/products/ProductCard';

type ProductListProps = {
  queryRef: PreloadedQuery<any>;
};

export default function ProductList({ queryRef }: ProductListProps) {
  const data = usePreloadedQuery(ProductsQuery, queryRef);
  
  return (
    <Grid columns={{ s: 1, m: 2, l: 3, xl: 4 }} gap={4}>
      {data.products && data.products.map((product: any) => (
        <View key={product.id}>
          <ProductCard product={product} />
        </View>
      ))}
    </Grid>
  );
} 