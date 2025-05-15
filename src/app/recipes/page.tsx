'use client';

import { Suspense } from 'react';
import { View, Text } from 'reshaped';
import { usePreloadedQuery, PreloadedQuery, useQueryLoader } from 'react-relay';
import { RecipeListQuery } from '@/graphql/queries/RecipeQueries';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { useEffect } from 'react';
import { AppContainer } from '@/components/layout/AppContainer';

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
        
        <Suspense fallback={<Text align="center">Loading recipes...</Text>}>
          {queryRef && <RecipeList queryRef={queryRef} />}
        </Suspense>
      </View>
    </AppContainer>
  );
}

type RecipeListProps = {
  queryRef: PreloadedQuery<any>; // Will be properly typed after Relay generates types
};

function RecipeList({ queryRef }: RecipeListProps) {
  const data = usePreloadedQuery(RecipeListQuery, queryRef);
  
  return (
    <View direction="row" gap={4} wrap>
      {data.publicRecipes.map((recipe: any) => (
        <View 
          key={recipe.id} 
          attributes={{
            style: {
              width: '100%',
              '@media (min-width: 576px)': {
                width: 'calc(50% - 16px)'
              },
              '@media (min-width: 768px)': {
                width: 'calc(33.333% - 16px)'
              }
            } as any
          }}
        >
          <RecipeCard recipe={recipe} />
        </View>
      ))}
    </View>
  );
} 