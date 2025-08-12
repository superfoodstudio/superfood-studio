'use client';

import { Suspense } from 'react';
import { View, Text, Card, Button } from 'reshaped';
import { useLazyLoadQuery } from 'react-relay';
import { useRouter } from 'next/navigation';
import { FeaturedRecipeQuery } from '@/graphql/queries/FeaturedRecipeQuery';
import type { FeaturedRecipeQueryQuery } from '@/__generated__/FeaturedRecipeQueryQuery.graphql';

function FeaturedRecipeContent() {
  const router = useRouter();
  
  const data = useLazyLoadQuery<FeaturedRecipeQueryQuery>(
    FeaturedRecipeQuery,
    {}
  );
  
  // Get the latest recipe (first in the edges)
  const recipe = data.publicRecipes?.edges?.[0]?.node;
  
  if (!recipe) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <Card
      padding={0}
      attributes={{
        style: {
          backgroundColor: '#f5f3f0',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          overflow: 'hidden',
          cursor: 'pointer'
        }
      }}
      onClick={() => router.push(`/recipes/${recipe.slug}`)}
    >
      <View direction="row" height="300px">
        {/* Recipe Image */}
        <View
          attributes={{
            style: {
              flex: '0 0 40%',
              position: 'relative'
            }
          }}
        >
          <img
            src={recipe.previewImageUrl || recipe.mediaUrl}
            alt={recipe.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </View>
        
        {/* Recipe Content */}
        <View
          direction="column"
          gap={3}
          padding={6}
          attributes={{
            style: {
              flex: 1,
              justifyContent: 'center'
            }
          }}
        >
          <View
            backgroundColor="primary-faded"
            attributes={{
              style: {
                display: 'inline-block',
                alignSelf: 'flex-start',
                borderRadius: '4px',
                padding: '4px 8px'
              }
            }}
          >
            <Text variant="caption-1" color="primary">
              {recipe.category.toUpperCase()}
            </Text>
          </View>
          
          <Text 
            variant="title-3"
            attributes={{
              style: {
                fontFamily: 'var(--font-big-caslon)',
                lineHeight: '1.2'
              }
            }}
          >
            {recipe.name}
          </Text>
          
          <Text 
            variant="body-2" 
            color="neutral-faded"
            attributes={{
              style: {
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }
            }}
          >
            {recipe.description}
          </Text>
          
          <View direction="row" justify="space-between" align="center">
            <Text variant="caption-1" color="neutral-faded">
              {formatDate(recipe.uploadDate)}
            </Text>
            <Button
              variant="solid"
              size="small"
              attributes={{
                style: {
                  backgroundColor: '#6b4c7a',
                  borderRadius: '15px',
                  fontSize: '10px',
                  fontWeight: '600',
                  letterSpacing: '0.5px'
                }
              }}
            >
              VIEW RECIPE
            </Button>
          </View>
        </View>
      </View>
    </Card>
  );
}

function FeaturedRecipeLoading() {
  return (
    <Card
      padding={6}
      attributes={{
        style: {
          backgroundColor: '#f5f3f0',
          border: '1px solid #e5e5e5',
          borderRadius: '12px',
          height: '200px'
        }
      }}
    >
      <View direction="column" align="center" justify="center" height="100%">
        <Text variant="body-2" color="neutral-faded">
          Loading featured recipe...
        </Text>
      </View>
    </Card>
  );
}

export function FeaturedRecipe() {
  return (
    <Suspense fallback={<FeaturedRecipeLoading />}>
      <FeaturedRecipeContent />
    </Suspense>
  );
}