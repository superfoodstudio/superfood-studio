'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { View, Text, Table, Button } from 'reshaped';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import { LoadMore } from '@/components/ui/LoadMore';
import { ListSkeleton } from '@/components/ui/ListSkeleton';
import { stripHtml } from '@/lib/textUtils';
import { ipfsUrl } from '@/lib/ipfs';
import { FeaturedRecipeQuery } from '@/graphql/queries/FeaturedRecipeQuery';

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
import type { FeaturedRecipeQueryQuery } from '@/__generated__/FeaturedRecipeQueryQuery.graphql';

function AdminRecipesContent() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortFilter, setSortFilter] = useState<string>('newest');

  // Use STATIC default variables so filter changes don't trigger Suspense
  const queryData = useLazyLoadQuery<pageRecipesPageQuery>(
    AdminRecipesPageQuery,
    {
      first: 20,
      after: null,
      category: null,
      status: null,
      search: null,
      sort: 'newest',
    }
  );

  const featuredData = useLazyLoadQuery<FeaturedRecipeQueryQuery>(
    FeaturedRecipeQuery,
    {}
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

  const recipes = data.recipesConnection?.edges?.map(edge => edge.node) || [];

  const handleLoadMore = () => {
    loadNext(20);
  };

  return (
    <View direction="column" gap={6}>
      <View direction="column" gap={1}>
        <Button variant="ghost" size="small" onClick={() => router.push('/admin')} attributes={{ style: { alignSelf: 'flex-start' } }}>
          ← Back
        </Button>
        <View direction="row" justify="space-between" align="center">
          <Text variant="body-1" weight="medium" attributes={{ style: { fontSize: '1.1rem' } }}>
            Recipes
          </Text>
          <Link href="/admin/recipes/new" passHref>
            <Button color="primary">Create New Recipe</Button>
          </Link>
        </View>
      </View>

      {/* Filters */}
      <View direction="column" gap={3}>
        <View direction="row" gap={2} align="center" wrap>
          <Text variant="caption-1" color="neutral-faded">Status:</Text>
          {(['all', 'live', 'not-live'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'outline' : 'ghost'}
              size="small"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status === 'live' ? 'Published' : 'Draft'}
            </Button>
          ))}
        </View>

        <View direction="row" gap={2} align="center" wrap>
          <Text variant="caption-1" color="neutral-faded">Sort:</Text>
          {(['newest', 'oldest', 'a-z', 'z-a'] as const).map((sort) => (
            <Button
              key={sort}
              variant={sortFilter === sort ? 'outline' : 'ghost'}
              size="small"
              onClick={() => setSortFilter(sort)}
            >
              {sort === 'newest' ? 'Newest' : sort === 'oldest' ? 'Oldest' : sort.toUpperCase()}
            </Button>
          ))}
        </View>
      </View>

      {/* Featured Recipe */}
      {featuredData.featuredRecipe && (
        <View direction="column" gap={2}>
          <Text variant="caption-1" color="neutral-faded" weight="medium">Featured</Text>
          <View
            attributes={{
              style: {
                border: '1px solid var(--rs-color-border-neutral-faded)',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                overflow: 'hidden',
              },
              onClick: () => router.push(`/admin/recipes/${featuredData.featuredRecipe!.id}`),
              onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.backgroundColor = 'var(--rs-color-background-neutral-faded)';
              },
              onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.backgroundColor = '';
              },
            }}
          >
            <View direction="row" align="center">
              {featuredData.featuredRecipe.previewImageUrl && (
                <img
                  src={ipfsUrl(featuredData.featuredRecipe.previewImageUrl)}
                  alt={featuredData.featuredRecipe.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', flexShrink: 0 }}
                />
              )}
              <View direction="row" justify="space-between" align="center" padding={4} attributes={{ style: { flex: 1 } }}>
                <View direction="column" gap={1}>
                  <Text weight="medium">{featuredData.featuredRecipe.name}</Text>
                  {featuredData.featuredRecipe.description && (
                    <Text variant="caption-1" color="neutral-faded">
                      {stripHtml(featuredData.featuredRecipe.description, 80)}
                    </Text>
                  )}
                </View>
                <View direction="row" gap={4} align="center">
                  <Text variant="caption-1" color="neutral-faded">{featuredData.featuredRecipe.category}</Text>
                  <Text variant="caption-1" color="neutral-faded">{formatDate(featuredData.featuredRecipe.uploadDate)}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Recipes Table */}
      {recipes.length === 0 ? (
        <View direction="column" align="center" justify="center" height="300px">
          <Text color="neutral-faded">No recipes found.</Text>
        </View>
      ) : (
        <>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Category</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Status</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Comments</Table.Heading>
                <Table.Heading attributes={{ className: 'hide-on-mobile' }}>Date</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {recipes.map((recipe) => (
                <Table.Row
                  key={recipe.id}
                  attributes={{
                    style: { cursor: 'pointer' },
                    onClick: () => router.push(`/admin/recipes/${recipe.id}`),
                  }}
                >
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
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1">{recipe.category}</Text>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1" color={recipe.isPublished ? 'neutral' : 'neutral-faded'}>
                      {recipe.isPublished ? 'Published' : 'Draft'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1" color="neutral-faded">{recipe.comments?.length || 0}</Text>
                  </Table.Cell>
                  <Table.Cell attributes={{ className: 'hide-on-mobile' }}>
                    <Text variant="caption-1" color="neutral-faded">{formatDate(recipe.uploadDate)}</Text>
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

export default function AdminRecipesPage() {
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
        <ListSkeleton rows={8} columns={5} />
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px' }}>
      <Suspense fallback={<ListSkeleton rows={8} columns={5} />}>
        <AdminRecipesContent />
      </Suspense>
    </div>
  );
}
