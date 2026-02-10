'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { View, Text, Table, Button } from 'reshaped';
import { LoadMore } from '@/components/ui/LoadMore';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { stripHtml } from '@/lib/textUtils';
import { FeaturedProductQuery } from '@/graphql/queries/FeaturedProductQuery';

// Define the query that includes the fragment
const AdminProductsPageQuery = graphql`
  query pageProductsPageQuery($first: Int!, $after: String, $category: String, $status: String, $search: String, $sort: String) {
    ...pageProductsPaginationFragment
  }
`;

// Define the pagination fragment
const AdminProductsPaginationFragment = graphql`
  fragment pageProductsPaginationFragment on Query
  @refetchable(queryName: "AdminProductsPaginationQuery") {
    productsConnection(first: $first, after: $after, category: $category, status: $status, search: $search, sort: $sort)
    @connection(key: "AdminProductsList_productsConnection") {
      edges {
        cursor
        node {
          id
          name
          slug
          description
          photoUrl
          videoUrl
          price
          category
          tags
          inventory
          isActive
          createdAt
          updatedAt
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

import type { pageProductsPageQuery } from '@/__generated__/pageProductsPageQuery.graphql';
import type { pageProductsPaginationFragment$key } from '@/__generated__/pageProductsPaginationFragment.graphql';

// Format price for display
function formatPrice(price: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function AdminProductsContent() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<string>('newest');

  // Use STATIC default variables so filter changes don't trigger Suspense
  const queryData = useLazyLoadQuery<pageProductsPageQuery>(
    AdminProductsPageQuery,
    {
      first: 20,
      after: null,
      category: null,
      status: null,
      search: null,
      sort: 'newest',
    }
  );

  const featuredData = useLazyLoadQuery<any>(
    FeaturedProductQuery,
    {}
  );

  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
    refetch,
  } = usePaginationFragment<pageProductsPageQuery, pageProductsPaginationFragment$key>(
    AdminProductsPaginationFragment,
    queryData
  );

  // Refetch when filters change (does NOT trigger Suspense)
  useEffect(() => {
    refetch({
      first: 20,
      after: null,
      category: null,
      status: statusFilter === 'all' ? null : statusFilter,
      search: null,
      sort: sortFilter,
    });
  }, [statusFilter, sortFilter, refetch]);

  const products = data.productsConnection?.edges?.map(edge => edge.node) || [];

  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(20);
    }
  }, [loadNext, isLoadingNext, hasNext]);

  return (
    <View direction="column" gap={6}>
      <View direction="row" justify="space-between" align="center">
        <View direction="row" align="center" gap={2}>
          <Button variant="ghost" size="small" onClick={() => router.push('/admin')}>
            ← Back
          </Button>
          <Text variant="body-1" weight="medium" attributes={{ style: { fontSize: '1.1rem' } }}>
            Products
          </Text>
        </View>
        <Link href="/admin/products/new" passHref>
          <Button color="primary">Create New Product</Button>
        </Link>
      </View>

      {/* Filters */}
      <View direction="column" gap={3}>
        <View direction="row" gap={2} align="center" wrap>
          <Text variant="caption-1" color="neutral-faded">Status:</Text>
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'outline' : 'ghost'}
              size="small"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status === 'active' ? 'Active' : 'Inactive'}
            </Button>
          ))}
        </View>

        <View direction="row" gap={2} align="center" wrap>
          <Text variant="caption-1" color="neutral-faded">Sort:</Text>
          {(['newest', 'oldest', 'a-z', 'z-a', 'price-low-high', 'price-high-low'] as const).map((sort) => {
            const labels: Record<string, string> = {
              'newest': 'Newest', 'oldest': 'Oldest', 'a-z': 'A-Z', 'z-a': 'Z-A',
              'price-low-high': 'Price asc', 'price-high-low': 'Price desc',
            };
            return (
              <Button
                key={sort}
                variant={sortFilter === sort ? 'outline' : 'ghost'}
                size="small"
                onClick={() => setSortFilter(sort)}
              >
                {labels[sort]}
              </Button>
            );
          })}
        </View>
      </View>

      {/* Featured Product */}
      {featuredData.featuredProduct && (
        <View direction="column" gap={2}>
          <Text variant="caption-1" color="neutral-faded" weight="medium">Featured</Text>
          <View
            padding={4}
            attributes={{
              style: {
                border: '1px solid var(--rs-color-border-neutral-faded)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              },
              onClick: () => router.push(`/admin/products/${featuredData.featuredProduct.id}`),
              onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.backgroundColor = 'var(--rs-color-background-neutral-faded)';
              },
              onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.backgroundColor = '';
              },
            }}
          >
            <View direction="row" justify="space-between" align="center">
              <View direction="column" gap={1}>
                <Text weight="medium">{featuredData.featuredProduct.name}</Text>
                {featuredData.featuredProduct.description && (
                  <Text variant="caption-1" color="neutral-faded">
                    {stripHtml(featuredData.featuredProduct.description, 80)}
                  </Text>
                )}
              </View>
              <View direction="row" gap={4} align="center">
                <Text variant="caption-1" color="neutral-faded">{featuredData.featuredProduct.category}</Text>
                <Text variant="caption-1">{formatPrice(featuredData.featuredProduct.price)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <View direction="column" align="center" justify="center" height="300px">
          <Text color="neutral-faded">No products found.</Text>
        </View>
      ) : (
        <>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Category</Table.Heading>
                <Table.Heading>Price</Table.Heading>
                <Table.Heading>Inventory</Table.Heading>
                <Table.Heading>Status</Table.Heading>
                <Table.Heading>Date</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {products.map((product) => (
                <Table.Row
                  key={product.id}
                  attributes={{
                    style: { cursor: 'pointer' },
                    onClick: () => router.push(`/admin/products/${product.id}`),
                  }}
                >
                  <Table.Cell>
                    <View direction="column" gap={1}>
                      <Text weight="medium">{product.name}</Text>
                      {product.description && (
                        <Text variant="caption-1" color="neutral-faded">
                          {stripHtml(product.description, 50)}
                        </Text>
                      )}
                    </View>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1">{product.category}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1">{formatPrice(product.price)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1" color="neutral-faded">{product.inventory}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1" color={product.isActive ? 'neutral' : 'neutral-faded'}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1" color="neutral-faded">{formatDate(product.createdAt)}</Text>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <LoadMore
            hasNext={hasNext}
            isLoadingNext={isLoadingNext}
            onLoadMore={handleLoadMore}
          />
        </>
      )}
    </View>
  );
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
        <ListSkeleton rows={8} columns={6} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      <Suspense fallback={<ListSkeleton rows={8} columns={6} />}>
        <AdminProductsContent />
      </Suspense>
    </div>
  );
}
