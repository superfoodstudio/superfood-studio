'use client';

import { Suspense } from 'react';
import { View, Grid, Text } from 'reshaped';
import { useLazyLoadQuery, usePaginationFragment, graphql } from 'react-relay';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LoadMore } from '@/components/ui/LoadMore';
import type { RecipesContentSimplePaginationFragment$key } from '@/__generated__/RecipesContentSimplePaginationFragment.graphql';

const recipesContentSimpleQuery = graphql`
  query RecipesContentSimpleQuery($first: Int!, $after: String) {
    ...RecipesContentSimplePaginationFragment
  }
`;

const recipesContentSimplePaginationFragment = graphql`
  fragment RecipesContentSimplePaginationFragment on Query
  @refetchable(queryName: "RecipesContentSimplePaginationQuery") {
    publicRecipes(first: $first, after: $after)
    @connection(key: "RecipesContentSimple_publicRecipes") {
      edges {
        node {
          id
          name
          slug
          description
          category
          mediaUrl
          previewImageUrl
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

function RecipeListContent() {
  const queryData = useLazyLoadQuery<any>(
    recipesContentSimpleQuery,
    { first: 12 }
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    recipesContentSimplePaginationFragment,
    queryData
  );
  
  if (!data.publicRecipes || data.publicRecipes.edges.length === 0) {
    return (
      <View padding={4}>
        <Text align="center">No recipes found</Text>
      </View>
    );
  }

  const handleLoadMore = () => {
    loadNext(12);
  };
  
  return (
    <View padding={4}>
      <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
        {data.publicRecipes.edges.map(({ node: recipe }: any) => (
          recipe && <RecipeCard key={recipe.id} recipe={recipe} />
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

function RecipeListSkeleton() {
  return (
    <View padding={4}>
      <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </Grid>
    </View>
  );
}

export function RecipesContentSimple() {
  return (
    <Suspense fallback={<RecipeListSkeleton />}>
      <RecipeListContent />
    </Suspense>
  );
}