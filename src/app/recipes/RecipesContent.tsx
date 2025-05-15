'use client';

import { Suspense, useEffect } from 'react';
import { View, Grid } from 'reshaped';
import { useQueryLoader } from 'react-relay';
import { RecipeListQuery } from '@/graphql/queries/RecipeQueries';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

// Placeholder - update with your actual component
const RecipeList = ({ queryRef }: any) => {
  return (
    <View padding={4}>
      <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
        {/* Recipe items would go here */}
        <SkeletonCard />
      </Grid>
    </View>
  );
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