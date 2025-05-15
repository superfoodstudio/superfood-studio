'use client';

import React from 'react';
import { graphql, useFragment } from 'react-relay';
import Link from 'next/link';
import { View, Text, Button } from 'reshaped';
import { RecipeCardFragment$key } from '@/__generated__/RecipeCardFragment.graphql';

// Use a unique name with proper module prefix
export const recipeCardFragment = graphql`
  fragment RecipeCardFragment on Recipe {
    id
    name
    slug
    description
    category
    mediaUrl
    uploadDate
  }
`;

// Temporary type until Relay generates the real one
type RecipeCardFragment = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  mediaUrl: string;
  uploadDate: string;
};

interface RecipeCardProps {
  recipe: RecipeCardFragment$key;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const data = useFragment(recipeCardFragment, recipe);
  
  return (
    <View 
      padding={3} 
      backgroundColor="neutral-faded"
      attributes={{
        style: {
          borderRadius: '8px',
          border: '1px solid var(--rs-color-border-neutral-faded)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }
      }}
    >
      <View direction="column" gap={3}>
        <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%' }}>
          <img
            src={data.mediaUrl}
            alt={data.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '8px' 
            }}
          />
        </div>
        <View direction="column" gap={2}>
          <Text variant="title-3">{data.name}</Text>
          <Text variant="body-2" color="neutral-faded">
            {data.category}
          </Text>
          <div style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            <Text variant="body-3">{data.description}</Text>
          </div>
        </View>
        <Link href={`/recipes/${data.slug}`} passHref>
          <Button fullWidth>View Recipe</Button>
        </Link>
      </View>
    </View>
  );
} 