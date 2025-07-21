'use client';

import React from 'react';
import { graphql, useFragment } from 'react-relay';
import Link from 'next/link';
import { View, Text, Button } from 'reshaped';

// Use a unique name with proper module prefix
export const recipeCardFragment = graphql`
  fragment RecipeCardFragment on Recipe {
    id
    name
    slug
    description
    category
    mediaUrl
    previewImageUrl
    uploadDate
  }
`;

// Type for direct recipe data (without fragment ref)
type RecipeData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  mediaUrl: string;
  previewImageUrl?: string | null;
  uploadDate: string;
};

interface RecipeCardProps {
  recipe: RecipeData;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const data = recipe;
  
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
          {data.previewImageUrl ? (
            <img
              src={data.previewImageUrl}
              alt={data.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '8px' 
              }}
              onError={(e) => {
                // Fallback to solid color if preview image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.style.backgroundColor = '#6b4c7a';
                  target.parentElement.style.display = 'flex';
                  target.parentElement.style.alignItems = 'center';
                  target.parentElement.style.justifyContent = 'center';
                  target.parentElement.innerHTML = `
                    <span style="color: white; font-size: 24px;">🎬</span>
                  `;
                }
              }}
            />
          ) : (
            <div
              style={{ 
                width: '100%', 
                height: '100%', 
                backgroundColor: '#6b4c7a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ color: 'white', fontSize: '24px' }}>🎬</span>
            </div>
          )}
        </div>
        <View direction="column" gap={2}>
          <Text variant="title-3" attributes={{ style: { fontFamily: 'var(--font-playfair)' } }}>{data.name}</Text>
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