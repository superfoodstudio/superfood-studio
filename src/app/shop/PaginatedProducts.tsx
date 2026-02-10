'use client';

import { useCallback } from 'react';
import { View, Grid, Text } from 'reshaped';
import { usePreloadedQuery, PreloadedQuery } from 'react-relay';
import { ProductsConnectionQuery } from '@/graphql/queries/ProductQueries';
import { ProductCard } from '@/components/products/ProductCard';
import Pagination from '@/components/common/Pagination';
import { ProductQueriesProductsConnectionQuery } from '@/__generated__/ProductQueriesProductsConnectionQuery.graphql';

interface PaginatedProductsProps {
  queryRef: PreloadedQuery<ProductQueriesProductsConnectionQuery>;
}

export default function PaginatedProducts({ queryRef }: PaginatedProductsProps) {
  const data = usePreloadedQuery(
    ProductsConnectionQuery,
    queryRef
  );

  const hasNext = data.productsConnection?.pageInfo?.hasNextPage || false;
  const hasPrevious = data.productsConnection?.pageInfo?.hasPreviousPage || false;
  const products = data.productsConnection?.edges || [];

  // To be implemented with useQueryLoader in parent component
  const handleLoadMore = useCallback(() => {
    // Will be implemented with pagination
  }, []);

  const handleLoadPrevious = useCallback(() => {
    // Will be implemented with pagination
  }, []);

  return (
    <View direction="column" gap={6}>
      <Text variant="title-5">Products</Text>
      
      {products.length === 0 ? (
        <View align="center" justify="center" padding={8}>
          <Text>No products found.</Text>
        </View>
      ) : (
        <>
          <Grid columns={{ s: 1, m: 2, l: 3, xl: 4 }} gap={4}>
            {products.map((edge: any) => (
              <ProductCard key={edge.node.id} product={edge.node} />
            ))}
          </Grid>
          
          <Pagination
            hasNextPage={hasNext}
            hasPreviousPage={hasPrevious}
            isLoading={false}
            onLoadMore={handleLoadMore}
            onLoadPrevious={handleLoadPrevious}
          />
        </>
      )}
    </View>
  );
} 