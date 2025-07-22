'use client';

import { Suspense, useState } from 'react';
import { View, Text, Button, Divider } from 'reshaped';
import { useLazyLoadQuery, useFragment } from 'react-relay';
import { RecipeDetailBySlugQuery, RecipeDetailFragment } from '@/graphql/queries/RecipeQueries';
import type { 
  RecipeQueriesRecipeDetailBySlugQuery
} from '@/__generated__/RecipeQueriesRecipeDetailBySlugQuery.graphql';
import type {
  RecipeQueriesRecipeDetail_recipe$key,
  RecipeQueriesRecipeDetail_recipe$data
} from '@/__generated__/RecipeQueriesRecipeDetail_recipe.graphql';
import { useEffect } from 'react';
import { AppContainer } from '@/components/layout/AppContainer';
import { useParams, useRouter } from 'next/navigation';
import { MediaDisplay } from '@/components/recipes/MediaDisplay';
import { RecipeComments } from '@/components/recipes/RecipeComments';
import { StarRating } from '@/components/ratings/StarRating';
import { RecipeDetailSkeleton } from '@/components/ui/RecipeDetailSkeleton';

// LazyLoad component that will only fetch data when it's needed
function RecipeDetailLazy({ slug }: { slug: string }) {
  const data = useLazyLoadQuery<RecipeQueriesRecipeDetailBySlugQuery>(
    RecipeDetailBySlugQuery,
    { slug },
    { fetchPolicy: 'store-or-network' } // Use cache if available, otherwise fetch
  );
  
  if (data.recipeBySlug) {
    return <RecipeDetailView recipeRef={data.recipeBySlug} />;
  }
  
  return <RecipeNotFound />;
}

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeSlug = params.slug as string;
  const [isReady, setIsReady] = useState(false);
  
  // Delay query execution until component is mounted
  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <AppContainer maxWidth={1000}>
      <Suspense fallback={<RecipeDetailSkeleton />}>
        {isReady && <RecipeDetailLazy slug={recipeSlug} />}
      </Suspense>
    </AppContainer>
  );
}

function RecipeNotFound() {
  const router = useRouter();
  return (
    <View direction="column" align="center" gap={4} padding={8}>
      <Text variant="title-2">Recipe not found</Text>
      <Button variant="solid" onClick={() => router.push('/recipes')}>
        Back to Recipes
      </Button>
    </View>
  );
}

type RecipeDetailViewProps = {
  recipeRef: RecipeQueriesRecipeDetail_recipe$key;
};

// This component always receives a valid recipe reference
function RecipeDetailView({ recipeRef }: RecipeDetailViewProps) {
  const router = useRouter();
  
  // Use the fragment to access recipe data with type safety
  const recipe: RecipeQueriesRecipeDetail_recipe$data = useFragment(
    RecipeDetailFragment,
    recipeRef
  );
  
  // Format date
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <View direction="column" gap={6}>
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        attributes={{ style: { alignSelf: 'flex-start' } }}
      >
        ← Back
      </Button>
      
      <View direction="column" gap={6}>
        {/* Recipe Media */}
        <MediaDisplay
          mediaUrl={recipe.mediaUrl}
          altText={recipe.name}
          style={{
            width: '100%',
            height: '400px'
          }}
        />
        
        {/* Recipe Header */}
        <View direction="column" gap={2}>
          <View 
            backgroundColor="primary-faded"
            padding={1}
            attributes={{
              style: {
                display: 'inline-block',
                alignSelf: 'flex-start',
                borderRadius: '4px',
                padding: '4px 8px'
              }
            }}
          >
            <Text variant="caption-1">
              {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
            </Text>
          </View>
          
          <Text variant="title-1">{recipe.name}</Text>
          <Text variant="body-2" color="neutral-faded">
            Published on {formatDate(recipe.uploadDate)}
          </Text>
        </View>
        
        {/* Recipe Description */}
        <Text variant="body-1">{recipe.description}</Text>
        
        {/* Rating Section */}
        <View direction="column" gap={2}>
          <Text variant="title-3">Rate this recipe</Text>
          <StarRating
            itemId={recipe.id}
            itemType="recipe"
            averageRating={recipe.averageRating || 0}
            totalRatings={recipe.totalRatings}
            size="large"
          />
        </View>
        
        <Divider />
        
        {/* Ingredients */}
        <View direction="column" gap={2}>
          <Text variant="title-2">Ingredients</Text>
          <View 
            backgroundColor="neutral-faded"
            padding={4}
            attributes={{
              style: {
                borderRadius: '8px'
              }
            }}
          >
            <View as="ul" direction="column" gap={2} attributes={{ style: { paddingLeft: '20px' } }}>
              {recipe.ingredients && recipe.ingredients.map((ingredient: string, index: number) => (
                <View as="li" key={index}>
                  <Text variant="body-1">{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Instructions */}
        <View direction="column" gap={2}>
          <Text variant="title-2">Instructions</Text>
          <View direction="column" gap={4}>
            {recipe.instructions && recipe.instructions.map((instruction: string, index: number) => (
              <View key={index} direction="row" gap={2} align="start">
                <View 
                  backgroundColor="primary"
                  attributes={{
                    style: {
                      minWidth: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }
                  }}
                >
                  <Text variant="body-1">{index + 1}</Text>
                </View>
                <Text variant="body-1">{instruction}</Text>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* Comments Section */}
        <RecipeComments recipeId={recipe.id} />
      </View>
    </View>
  );
} 