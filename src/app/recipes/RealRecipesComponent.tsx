'use client';

import { Suspense, useEffect } from 'react';
import { View, Grid, Text } from 'reshaped';
import { useQueryLoader, usePreloadedQuery } from 'react-relay';
import { RecipeListQuery } from '@/graphql/queries/RecipeQueries';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import dynamic from 'next/dynamic';
import { RecipeQueriesRecipeListQuery } from '@/__generated__/RecipeQueriesRecipeListQuery.graphql';

// Dynamically import RecipeCard with SSR disabled
const RecipeCard = dynamic(
  () => import('@/components/recipes/RecipeCard').then(mod => mod.RecipeCard),
  { ssr: false }
);

// Proper implementation of RecipeList that uses the generated types
const RecipeList = ({ queryRef }: { queryRef: any }) => {
  try {
    const data = usePreloadedQuery<RecipeQueriesRecipeListQuery>(
      RecipeListQuery,
      queryRef
    );
    
    // Handle case where data is missing
    if (!data.publicRecipes || data.publicRecipes.edges.length === 0) {
      return (
        <View padding={4}>
          <Text>No recipes found</Text>
        </View>
      );
    }
    
    return (
      <View padding={4}>
        <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
          {data.publicRecipes.edges.map(({ node: recipe }: any) => (
            recipe && <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </Grid>
      </View>
    );
  } catch (error) {
    console.error("Error rendering recipe list:", error);
    return <RecipeListSkeleton />;
  }
};

// This component will be dynamically loaded on the client
export default function RealRecipesComponent() {
  const [queryRef, loadQuery] = useQueryLoader(RecipeListQuery);

  useEffect(() => {
    try {
      loadQuery({ 
        category: null,
        first: 12,
        after: null
      });
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  }, [loadQuery]);

  return (
    <Suspense fallback={<RecipeListSkeleton />}>
      {queryRef && <RecipeList queryRef={queryRef} />}
    </Suspense>
  );
}

function RecipeListSkeleton() {
  return (
    <Grid columns={{ s: 1, m: 2, l: 3, xl: 3 }} gap={4}>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
} 