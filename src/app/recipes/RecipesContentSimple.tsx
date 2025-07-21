'use client';

import { Suspense } from 'react';
import { View, Grid, Text } from 'reshaped';
import { useLazyLoadQuery } from 'react-relay';
import { RecipeListQuery } from '@/graphql/queries/RecipeQueries';
import type { RecipeQueriesRecipeListQuery } from '@/__generated__/RecipeQueriesRecipeListQuery.graphql';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { RecipeCard } from '@/components/recipes/RecipeCard';

function RecipeListContent() {
  const data = useLazyLoadQuery<RecipeQueriesRecipeListQuery>(
    RecipeListQuery,
    { 
      category: null,
      limit: 12,
      offset: 0
    }
  );
  
  if (!data.publicRecipes || data.publicRecipes.length === 0) {
    return (
      <View padding={4}>
        <Text align="center">No recipes found</Text>
      </View>
    );
  }
  
  return (
    <View padding={4}>
      <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
        {data.publicRecipes.map((recipe) => (
          recipe && <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Grid>
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