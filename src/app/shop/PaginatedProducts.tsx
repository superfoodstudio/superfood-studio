'use client';

import { useCallback } from 'react';
import { View, Grid, Text } from 'reshaped';
import { usePreloadedQuery, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { ProductCard } from '@/components/products/ProductCard';
import Pagination from '@/components/common/Pagination';

// Define the fragment for pagination
export const PaginatedProductsFragment = graphql`
  fragment PaginatedProducts_products on Query
  @refetchable(queryName: "PaginatedProductsPaginationQuery") {
    productsConnection(
      first: $first
      after: $after
      category: $category
    ) {
      edges {
        cursor
        node {
          id
          ...ProductCardFragment
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Define the query that uses the fragment
export const PaginatedProductsInitialQuery = graphql`
  query PaginatedProductsQuery(
    $first: Int!
    $after: String
    $category: String
  ) {
    ...PaginatedProducts_products
  }
`;

interface PaginatedProductsProps {
  queryRef: any; // This should be properly typed once the generated types are available
}

export default function PaginatedProducts({ queryRef }: PaginatedProductsProps) {
  const query = usePreloadedQuery(
    PaginatedProductsInitialQuery,
    queryRef
  );

  const { data, loadNext, loadPrevious, hasNext, hasPrevious, isLoadingNext, isLoadingPrevious } =
    usePaginationFragment(
      PaginatedProductsFragment,
      query
    );

  const handleLoadMore = useCallback(() => {
    if (isLoadingNext) return;
    loadNext(8);
  }, [isLoadingNext, loadNext]);

  const handleLoadPrevious = useCallback(() => {
    if (isLoadingPrevious) return;
    loadPrevious(8);
  }, [isLoadingPrevious, loadPrevious]);

  const products = data?.productsConnection?.edges || [];

  return (
    <View direction="column" gap={6}>
      <Text variant="title-2">Products</Text>
      
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
            isLoading={isLoadingNext || isLoadingPrevious}
            onLoadMore={handleLoadMore}
            onLoadPrevious={handleLoadPrevious}
          />
        </>
      )}
    </View>
  );
} 