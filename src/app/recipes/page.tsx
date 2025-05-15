'use client';

import { Suspense } from 'react';
import { View, Text, Grid } from 'reshaped';
import { usePreloadedQuery, PreloadedQuery, useQueryLoader } from 'react-relay';
import { RecipeListQuery } from '@/graphql/queries/RecipeQueries';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { useEffect } from 'react';
import { AppContainer } from '@/components/layout/AppContainer';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

export default function RecipesPage() {
  const [queryRef, loadQuery] = useQueryLoader(RecipeListQuery);

  useEffect(() => {
    loadQuery({ limit: 12, offset: 0 });
  }, [loadQuery]);

  return (
    <AppContainer>
      <View direction="column" gap={4}>
        <View direction="column" align="center" padding={4}>
          <Text variant="title-1" align="center">Our Recipes</Text>
          <Text variant="body-1" align="center">
            Discover our collection of healthy and delicious recipes
          </Text>
        </View>
        
        <Suspense fallback={<RecipeListSkeleton />}>
          {queryRef && <RecipeList queryRef={queryRef} />}
        </Suspense>
      </View>
    </AppContainer>
  );
}

function RecipeListSkeleton() {
  return (
    <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
}

type RecipeListProps = {
  queryRef: PreloadedQuery<any>; // Will be properly typed after Relay generates types
};

function RecipeList({ queryRef }: RecipeListProps) {
  const data = usePreloadedQuery(RecipeListQuery, queryRef);
  
  return (
    <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
      {data.publicRecipes.map((recipe: any) => (
        <View key={recipe.id}>
          <RecipeCard recipe={recipe} />
        </View>
      ))}
    </Grid>
  );
} 