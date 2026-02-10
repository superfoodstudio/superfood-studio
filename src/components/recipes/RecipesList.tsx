'use client';

import React, { Suspense, useCallback } from 'react';
import { graphql, useLazyLoadQuery, usePaginationFragment } from 'react-relay';
import { RecipeCard } from './RecipeCard';
import { View, Text } from 'reshaped';
import { LoadMore } from '@/components/ui/LoadMore';
import { RecipesListQuery } from '@/__generated__/RecipesListQuery.graphql';
import type { RecipesListPaginationFragment$key } from '@/__generated__/RecipesListPaginationFragment.graphql';

const recipesListQuery = graphql`
  query RecipesListQuery($category: String, $first: Int!, $after: String) {
    ...RecipesListPaginationFragment
  }
`;

const recipesListPaginationFragment = graphql`
  fragment RecipesListPaginationFragment on Query
  @refetchable(queryName: "RecipesListPaginationQuery") {
    publicRecipes(category: $category, first: $first, after: $after)
    @connection(key: "RecipesList_publicRecipes") {
      edges {
        node {
          id
          name
          slug
          description
          category
          mediaUrl
          uploadDate
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

interface RecipesListProps {
  category?: string;
}

function RecipesListContent({ category }: RecipesListProps) {
  const queryData = useLazyLoadQuery<RecipesListQuery>(
    recipesListQuery,
    { category, first: 12 }
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    RecipesListQuery,
    RecipesListPaginationFragment$key
  >(recipesListPaginationFragment, queryData);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(12);
    }
  }, [loadNext, isLoadingNext, hasNext]);

  if (!data.publicRecipes || data.publicRecipes.edges.length === 0) {
    return (
      <View padding={4}>
        <Text>No recipes found</Text>
      </View>
    );
  }

  return (
    <View direction="column" gap={4}>
      <Text variant="title-5">Recipes</Text>
      <View 
        direction={{ s: 'column', m: 'row' }} 
        gap={3}
        wrap
      >
        {data.publicRecipes.edges.map(({ node: recipe }) => (
          <div 
            key={recipe.id} 
            style={{ 
              flex: '1 1 auto', 
              minWidth: '300px', 
              maxWidth: '450px', 
              margin: '8px' 
            }}
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </View>
      <LoadMore
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        onLoadMore={handleLoadMore}
      />
    </View>
  );
}

// Loading fallback component
function RecipesListFallback() {
  return (
    <View height="200px" align="center" justify="center">
      <div className="loading-spinner" style={{
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

// Error boundary fallback
function RecipesListError({ message }: { message: string }) {
  return (
    <View 
      padding={4} 
      attributes={{
        style: {
          backgroundColor: '#fdeded',
          borderRadius: '8px'
        }
      }}
    >
      <Text color="critical">Error loading recipes: {message}</Text>
    </View>
  );
}

export function RecipesList(props: RecipesListProps) {
  return (
    <Suspense fallback={<RecipesListFallback />}>
      <RecipesListContent {...props} />
    </Suspense>
  );
} 