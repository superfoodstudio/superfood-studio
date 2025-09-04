'use client';

import { useState, useEffect, Suspense } from 'react';
import { View, Text, Table, Button, Card } from 'reshaped';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { LoadMore } from '@/components/ui/LoadMore';
import { stripHtml } from '@/lib/textUtils';

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Define the query that includes the fragment
const AdminRecipesPageQuery = graphql`
  query pageRecipesPageQuery($first: Int!, $after: String, $category: String, $status: String, $search: String, $sort: String) {
    ...pageRecipesPaginationFragment
  }
`;

// Define the pagination fragment
const AdminRecipesPaginationFragment = graphql`
  fragment pageRecipesPaginationFragment on Query
  @refetchable(queryName: "AdminRecipesPaginationQuery") {
    recipesConnection(
      first: $first
      after: $after
      category: $category
      status: $status
      search: $search
      sort: $sort
    ) @connection(key: "AdminRecipesList_recipesConnection") {
      edges {
        cursor
        node {
          id
          name
          slug
          description
          category
          isPublished
          mediaUrl
          previewImageUrl
          uploadDate
          createdAt
          updatedAt
          ingredients
          instructions
          comments {
            id
          }
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

import type { pageRecipesPageQuery } from '@/__generated__/pageRecipesPageQuery.graphql';
import type { pageRecipesPaginationFragment$key } from '@/__generated__/pageRecipesPaginationFragment.graphql';

function AdminRecipesContent() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [sortFilter, setSortFilter] = useState<string>('newest');
  
  const queryData = useLazyLoadQuery<pageRecipesPageQuery>(
    AdminRecipesPageQuery,
    {
      first: 20,
      after: null,
      category: categoryFilter || null,
      status: statusFilter === 'all' ? null : statusFilter,
      search: searchFilter || null,
      sort: sortFilter,
    },
    { fetchPolicy: 'store-and-network' } // Force refetch when variables change
  );

  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext,
    refetch,
  } = usePaginationFragment<pageRecipesPageQuery, pageRecipesPaginationFragment$key>(
    AdminRecipesPaginationFragment, 
    queryData
  );

  // Refetch when filters change
  useEffect(() => {
    refetch({
      first: 20,
      after: null,
      category: categoryFilter || null,
      status: statusFilter === 'all' ? null : statusFilter,
      search: searchFilter || null,
      sort: sortFilter,
    });
  }, [statusFilter, categoryFilter, searchFilter, sortFilter, refetch]);

  const recipes = data.recipesConnection?.edges?.map(edge => edge.node) || [];
  
  // Debug logging
  console.log('Admin Recipes Debug:', {
    statusFilter,
    categoryFilter, 
    searchFilter,
    sortFilter,
    recipesConnectionExists: !!data.recipesConnection,
    edgesCount: data.recipesConnection?.edges?.length || 0,
    recipes: recipes.length
  });
  
  const handleLoadMore = () => {
    loadNext(20);
  };

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

  // Handler for navigating to the edit page
  const handleEditClick = (id: string) => {
    router.push(`/admin/recipes/${id}`);
  };

  return (
    <View direction="column" gap={6} padding={8}>
      <View direction="row" justify="space-between" align="center">
        <Text 
          variant="body-1" 
          weight="medium"
          attributes={{
            style: {
              fontFamily: 'var(--font-midruns-sans)',
              fontSize: '1.25rem'
            }
          }}
        >
          Manage Recipes
        </Text>
        <Link href="/admin/recipes/new" passHref>
          <Button>Create New Recipe</Button>
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
            variant={statusFilter === 'live' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleStatusFilter('live')}
          >
            Published
          </Button>
          <Button
            variant={statusFilter === 'not-live' ? 'solid' : 'outline'}
            size="small"
            onClick={() => handleStatusFilter('not-live')}
          >
            Draft
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
        </View>
      </View>

      {/* Recipes Table */}
      {recipes.length === 0 ? (
        <View direction="column" align="center" justify="center" height="300px">
          <Text>No recipes found.</Text>
        </View>
      ) : (
        <>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Category</Table.Heading>
                <Table.Heading>Published</Table.Heading>
                <Table.Heading>Comments</Table.Heading>
                <Table.Heading>Upload Date</Table.Heading>
                <Table.Heading>Actions</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {recipes.map((recipe) => (
                <Table.Row key={recipe.id}>
                  <Table.Cell>
                    <View direction="column" gap={1}>
                      <Text weight="medium">{recipe.name}</Text>
                      {recipe.description && (
                        <Text variant="caption-1" color="neutral-faded">
                          {stripHtml(recipe.description, 50)}
                        </Text>
                      )}
                    </View>
                  </Table.Cell>
                  <Table.Cell>{recipe.category}</Table.Cell>
                  <Table.Cell>
                    <span 
                      style={{ 
                        color: recipe.isPublished ? '#2e7d32' : '#c62828',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: recipe.isPublished ? '#e8f5e9' : '#ffebee',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {recipe.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1">{recipe.comments?.length || 0} comments</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text variant="caption-1">{formatDate(recipe.uploadDate)}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <View direction="row" gap={2}>
                      <Button 
                        variant="outline" 
                        size="small" 
                        onClick={() => handleEditClick(recipe.id)}
                      >
                        Edit
                      </Button>
                    </View>
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

function AdminRecipesLoading() {
  return (
    <View direction="column" gap={4}>
      <View padding={4}>
        <Text>Loading recipes...</Text>
      </View>
    </View>
  );
}

export default function AdminRecipesPage() {
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
    <Suspense fallback={<AdminRecipesLoading />}>
      <AdminRecipesContent />
    </Suspense>
  );
} 