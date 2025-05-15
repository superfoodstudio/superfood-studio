'use client';

import { Suspense, useEffect } from 'react';
import { View, Grid, Text } from 'reshaped';
import { useQueryLoader, usePreloadedQuery } from 'react-relay';
import { RecipeListQuery } from '@/graphql/queries/RecipeQueries';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import dynamic from 'next/dynamic';

// Dynamically import RecipeCard with SSR disabled
const RecipeCard = dynamic(
  () => import('@/components/recipes/RecipeCard').then(mod => mod.RecipeCard),
  { ssr: false }
);

// Create a safe non-typed version to avoid TypeScript errors
const RecipeList = ({ queryRef }: { queryRef: any }) => {
  try {
    // Attempt to load data but handle any errors
    const data: any = usePreloadedQuery(RecipeListQuery, queryRef);
    
    if (!data || !data.publicRecipes || data.publicRecipes.length === 0) {
      return (
        <Grid columns={{ s: 1 }} gap={4}>
          <Text variant="body-1">No recipes found</Text>
        </Grid>
      );
    }
    
    return (
      <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
        {/* Add a key to force re-rendering if needed */}
        {Array.isArray(data.publicRecipes) && data.publicRecipes.map((recipe: any, index: number) => (
          <div key={recipe?.id || index}>
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </Grid>
    );
  } catch (error) {
    console.error("Error rendering recipe list:", error);
    return <Text variant="body-1">Error loading recipes</Text>;
  }
};

export default function RecipesContent() {
  const [queryRef, loadQuery] = useQueryLoader(RecipeListQuery);

  useEffect(() => {
    try {
      loadQuery({ 
        category: null,
        status: "published",
        search: null,
        sort: "newest"
      });
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  }, [loadQuery]);

  return (
    <View padding={4}>
      <Suspense fallback={<RecipeListSkeleton />}>
        {queryRef && <RecipeList queryRef={queryRef} />}
      </Suspense>
    </View>
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