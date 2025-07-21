'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { View, Text, Table, Button, Card } from 'reshaped';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortFilter, setSortFilter] = useState<string>('newest');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  const queryData = useLazyLoadQuery<pageProductsPageQuery>(
    AdminProductsPageQuery,
    {
      first: 20,
      after: null,
      category: categoryFilter || null,
      status: statusFilter === 'all' ? null : statusFilter,
      search: searchFilter || null,
      sort: sortFilter,
    }
  );

  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<pageProductsPageQuery, pageProductsPaginationFragment$key>(
    AdminProductsPaginationFragment, 
    queryData
  );

  const products = data.productsConnection?.edges?.map(edge => edge.node) || [];
  
  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNext || isLoadingNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNext && !isLoadingNext) {
          loadNext(20);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNext, isLoadingNext, loadNext]);

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleCategoryFilter = (category: string) => {
    setCategoryFilter(category);
  };

  const handleSearchFilter = (search: string) => {
    setSearchFilter(search);
  };

  const handleSortFilter = (sort: string) => {
    setSortFilter(sort);
  };

  return (
    <View direction="column" gap={6}>
      <View direction="row" justify="space-between" align="center">
        <Text variant="title-2">Products</Text>
        <Link href="/admin/products/new" passHref>
          <Button>+ New Product</Button>
        </Link>
      </View>

      {/* Filters */}
      <View direction="column" gap={4}>
        <View direction="row" gap={2} align="center" wrap>
          <Text>Status:</Text>
          <Button
            variant={statusFilter === 'all' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleStatusFilter('inactive')}
          >
            Inactive
          </Button>
        </View>

        <View direction="row" gap={2} align="center" wrap>
          <Text>Sort:</Text>
          <Button
            variant={sortFilter === 'newest' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleSortFilter('newest')}
          >
            Newest
          </Button>
          <Button
            variant={sortFilter === 'oldest' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleSortFilter('oldest')}
          >
            Oldest
          </Button>
          <Button
            variant={sortFilter === 'a-z' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleSortFilter('a-z')}
          >
            A-Z
          </Button>
          <Button
            variant={sortFilter === 'z-a' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleSortFilter('z-a')}
          >
            Z-A
          </Button>
          <Button
            variant={sortFilter === 'price-low-high' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleSortFilter('price-low-high')}
          >
            Price ↑
          </Button>
          <Button
            variant={sortFilter === 'price-high-low' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleSortFilter('price-high-low')}
          >
            Price ↓
          </Button>
        </View>
      </View>

      {/* Products Table */}
      {products.length === 0 ? (
        <View direction="column" align="center" justify="center" height="300px">
          <Text>No products found.</Text>
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
                <Table.Heading>Created</Table.Heading>
                <Table.Heading>Actions</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>
                    <View direction="column" gap={1}>
                      <Text weight="medium">{product.name}</Text>
                      {product.description && (
                        <Text variant="caption-1" color="neutral-faded">
                          {product.description.length > 50 
                            ? `${product.description.substring(0, 50)}...`
                            : product.description}
                        </Text>
                      )}
                    </View>
                  </Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>{formatPrice(product.price)}</Table.Cell>
                  <Table.Cell>{product.inventory}</Table.Cell>
                  <Table.Cell>
                    <span 
                      style={{ 
                        color: product.isActive ? '#2e7d32' : '#c62828',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: product.isActive ? '#e8f5e9' : '#ffebee',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1">{formatDate(product.createdAt)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <View direction="row" gap={2}>
                      <Link href={`/admin/products/${product.id}`} passHref>
                        <Button size="small" variant="outline">Edit</Button>
                      </Link>
                    </View>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          
          {/* Infinite scroll trigger */}
          {hasNext && (
            <div 
              ref={loadMoreRef}
              style={{ height: '10px', visibility: 'hidden' }}
            />
          )}
          
          {/* Loading indicator */}
          {isLoadingNext && (
            <View direction="column" align="center" padding={4}>
              <Text variant="caption-1" color="neutral-faded">
                Loading more products...
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

function AdminProductsLoading() {
  return (
    <View direction="column" gap={4}>
      <Text variant="title-2">Products</Text>
      <View padding={4}>
        <Text>Loading products...</Text>
      </View>
    </View>
  );
}

export default function AdminProductsPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <View direction="column" align="center" justify="center" height="300px">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
      <View direction="column" gap={6} padding={8}>
        <Card padding={6}>
          <Suspense fallback={<AdminProductsLoading />}>
            <AdminProductsContent />
          </Suspense>
        </Card>
      </View>
    </div>
  );
} 