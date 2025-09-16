'use client';

import { useState, useEffect } from 'react';
import { View, Text, Button } from 'reshaped';
import { Star } from 'phosphor-react';
import { usePrivy } from '@privy-io/react-auth';

interface StarRatingProps {
  itemId: string;
  itemType: 'recipe' | 'product';
  initialRating?: number;
  averageRating?: number;
  totalRatings?: number;
  size?: 'small' | 'medium' | 'large';
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  itemId,
  itemType,
  initialRating = 0,
  averageRating,
  totalRatings = 0,
  size = 'medium',
  readonly = false,
  onRatingChange
}: StarRatingProps) {
  const { authenticated, getAccessToken } = usePrivy();
  const [userRating, setUserRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Star size mapping
  const starSize = {
    small: 16,
    medium: 20,
    large: 24
  }[size];

  const textSize = {
    small: 'body-2',
    medium: 'body-1',
    large: 'featured-3'
  }[size] as any;

  // Fetch user's current rating on mount
  useEffect(() => {
    if (authenticated && !readonly) {
      fetchUserRating();
    }
  }, [authenticated, itemId, itemType, readonly]);

  const fetchUserRating = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch(`/api/${itemType}s/${itemId}/rate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.rating) {
          setUserRating(data.rating.rating);
        }
      }
    } catch (error) {
      console.error(`Error fetching user ${itemType} rating:`, error);
    }
  };

  const handleRating = async (rating: number) => {
    if (readonly || !authenticated || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      const response = await fetch(`/api/${itemType}s/${itemId}/rate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating })
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(data.rating);
        onRatingChange?.(data.rating);
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error(`Error rating ${itemType}:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating || userRating || averageRating || 0;

  return (
    <View direction="row" align="center" gap={1}>
      {/* Rating number before stars */}
      {averageRating !== undefined && averageRating > 0 && (
        <View align="center" justify="center">
          <Text variant="caption-1" color="neutral-faded">
            {averageRating.toFixed(1)}
          </Text>
        </View>
      )}

      {/* Stars */}
      <View direction="row" align="center" gap={0.5}>
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= displayRating;
          const isHovered = !readonly && star <= hoveredRating;

          return (
            <View key={star} align="center" justify="center">
              {readonly ? (
                <Star
                  size={starSize}
                  weight={isActive ? 'fill' : 'regular'}
                  style={{
                    color: isActive ? '#F5D565' : '#E5E5E5',
                    display: 'block'
                  }}
                />
              ) : (
                <Button
                  variant="ghost"
                  attributes={{
                    style: {
                      padding: '2px',
                      minWidth: 'auto',
                      height: 'auto',
                      cursor: authenticated ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    },
                    onMouseEnter: () => authenticated && setHoveredRating(star),
                    onMouseLeave: () => setHoveredRating(0)
                  }}
                  disabled={!authenticated || isSubmitting}
                  onClick={() => handleRating(star)}
                >
                  <Star
                    size={starSize}
                    weight={isActive || isHovered ? 'fill' : 'regular'}
                    style={{
                      color: isActive || isHovered ? '#F5D565' : '#E5E5E5',
                      transition: 'color 0.2s ease',
                      display: 'block'
                    }}
                  />
                </Button>
              )}
            </View>
          );
        })}
      </View>

      {/* Count after stars */}
      {totalRatings > 0 && (
        <View align="center" justify="center">
          <Text variant="caption-1" color="neutral-faded">
            ({totalRatings})
          </Text>
        </View>
      )}
    </View>
  );
}