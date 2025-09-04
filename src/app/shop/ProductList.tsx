'use client';

import React, { Suspense, useCallback } from 'react';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { ProductCard, ProductCardFragment } from '@/components/products/ProductCard';
import { View, Grid } from 'reshaped';
import { LoadMore } from '@/components/ui/LoadMore';
import { ProductListQuery } from '@/__generated__/ProductListQuery.graphql';
import type { ProductListPaginationFragment$key } from '@/__generated__/ProductListPaginationFragment.graphql';

const productListQuery = graphql`
  query ProductListQuery($category: String, $first: Int!, $after: String, $status: String, $search: String, $sort: String) {
    ...ProductListPaginationFragment
  }
`;

const productListPaginationFragment = graphql`
  fragment ProductListPaginationFragment on Query
  @refetchable(queryName: "ProductListPaginationQuery") {
    productsConnection(category: $category, first: $first, after: $after, status: $status, search: $search, sort: $sort)
    @connection(key: "ProductList_productsConnection") {
      edges {
        node {
          id
          ...ProductCardFragment
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface ProductListProps {
  category?: string;
}

function ProductListContent({ category }: ProductListProps) {
  const queryData = useLazyLoadQuery<ProductListQuery>(
    productListQuery,
    { category, first: 4, status: "active", search: null, sort: "newest" }
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    ProductListQuery,
    ProductListPaginationFragment$key
  >(productListPaginationFragment, queryData);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(4);
    }
  }, [loadNext, isLoadingNext, hasNext]);

  if (!data.productsConnection || data.productsConnection.edges.length === 0) {
    return (
      <View padding={4}>
        <Grid columns={{ s: 1, m: 2, l: 3, xl: 4 }} gap={4}>
          <View>No products found</View>
        </Grid>
      </View>
    );
  }

  return (
    <View direction="column" gap={4}>
      <Grid columns={{ s: 1, m: 2, l: 3, xl: 4 }} gap={4}>
        {data.productsConnection.edges.map(({ node: product }) => (
          <View key={product.id}>
            <ProductCard product={product} />
          </View>
        ))}
      </Grid>
      <LoadMore
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        onLoadMore={handleLoadMore}
      />
    </View>
  );
}

// Loading fallback component
function ProductListFallback() {
  return (
    <View height="200px" align="center" justify="center">
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        borderTopColor: '#2E1A47',
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </View>
  );
}

export default function ProductList(props: ProductListProps) {
  return (
    <Suspense fallback={<ProductListFallback />}>
      <ProductListContent {...props} />
    </Suspense>
  );
} 