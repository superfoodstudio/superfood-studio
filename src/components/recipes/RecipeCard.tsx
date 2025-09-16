'use client';

import React from 'react';
import { graphql, useFragment } from 'react-relay';
import Link from 'next/link';
import { View, Text, Card } from 'reshaped';
import { StarRating } from '@/components/ratings/StarRating';
import { stripHtml } from '@/lib/textUtils';

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
                <img
                  src={data.previewImageUrl}
                  alt={data.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#6b4c7a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <span style={{ color: "white", fontSize: "24px" }}>🎬</span>
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