'use client';

import React from 'react';
import { graphql, useFragment } from 'react-relay';
import Link from 'next/link';
import Image from 'next/image';
import { View, Text, Card } from 'reshaped';
import { StarRating } from '@/components/ratings/StarRating';
import { stripHtml } from '@/lib/textUtils';
import { ipfsUrl } from '@/lib/ipfs';

// Use a unique name with proper module prefix
export const recipeCardFragment = graphql`
  fragment RecipeCardFragment on Recipe {
    id
    name
    slug
    description
    category
    servingSize
    totalTime
    prepTime
    cookTime
    mediaUrl
    previewImageUrl
    uploadDate
    averageRating
    totalRatings
  }
`;

// Type for direct recipe data (without fragment ref)
type RecipeData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  servingSize?: string | null;
  totalTime?: number | null;
  prepTime?: number | null;
  cookTime?: number | null;
  mediaUrl: string;
  previewImageUrl?: string | null;
  uploadDate: string;
  averageRating?: number | null;
  totalRatings?: number;
};

interface RecipeCardProps {
  recipe: RecipeData;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const data = recipe;
  
  return (
    <View height="360px" width="100%">
      <Link
        href={`/recipes/${data.slug}`}
        style={{ textDecoration: "none", height: "100%", display: "block" }}
      >
        <Card padding={0} height="100%">
          <View direction="column" height="100%">
            {/* Image container */}
            <View
              position="relative"
              width="100%"
              height="200px"
              overflow="hidden"
            >
              {data.previewImageUrl ? (
                <Image
                  src={ipfsUrl(data.previewImageUrl)}
                  alt={data.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#e0ddd8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a8a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>
                </div>
              )}
            </View>

            {/* Content section */}
            <View direction="column" gap={1} padding={2} position="relative" attributes={{ style: { flex: 1 } }}>
              <Text variant="featured-3" weight="medium" maxLines={1}>{data.name}</Text>
              <Text variant="body-2" color="neutral-faded" maxLines={1}>
                {data.category}
              </Text>

              {/* Rating Display */}
              <StarRating
                itemId={data.id}
                itemType="recipe"
                averageRating={data.averageRating || 0}
                totalRatings={data.totalRatings || 0}
                size="small"
                readonly={true}
              />

              {/* Recipe Info */}
              {data.totalTime && (
                <Text variant="caption-1" color="neutral-faded">
                  {data.totalTime} minutes
                </Text>
              )}
            </View>
          </View>
        </Card>
      </Link>
    </View>
  );
} 