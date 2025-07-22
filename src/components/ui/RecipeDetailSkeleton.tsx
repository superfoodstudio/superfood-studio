'use client';

import { View, Skeleton, Divider } from 'reshaped';

export function RecipeDetailSkeleton() {
  return (
    <View direction="column" gap={6}>
      {/* Back button skeleton */}
      <Skeleton height="2rem" width="4rem" borderRadius="small" />
      
      <View direction="column" gap={6}>
        {/* Recipe Media skeleton */}
        <View
          attributes={{
            style: {
              width: '100%',
              height: '400px'
            }
          }}
        >
          <Skeleton width="100%" height="100%" borderRadius="medium" />
        </View>
        
        {/* Recipe Header */}
        <View direction="column" gap={2}>
          {/* Category badge */}
          <Skeleton height="1.5rem" width="6rem" borderRadius="small" />
          
          {/* Title */}
          <Skeleton height="2.5rem" width="75%" borderRadius="small" />
          
          {/* Date */}
          <Skeleton height="1rem" width="50%" borderRadius="small" />
        </View>
        
        {/* Description */}
        <View direction="column" gap={1}>
          <Skeleton height="1rem" width="100%" borderRadius="small" />
          <Skeleton height="1rem" width="95%" borderRadius="small" />
          <Skeleton height="1rem" width="85%" borderRadius="small" />
        </View>
        
        {/* Rating Section */}
        <View direction="column" gap={2}>
          <Skeleton height="1.5rem" width="60%" borderRadius="small" />
          <View direction="row" gap={1}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Skeleton key={star} height="1.5rem" width="1.5rem" borderRadius="small" />
            ))}
          </View>
          <Skeleton height="1rem" width="50%" borderRadius="small" />
        </View>
        
        <Divider />
        
        {/* Ingredients Section */}
        <View direction="column" gap={2}>
          <Skeleton height="2rem" width="30%" borderRadius="small" />
          <View 
            attributes={{
              style: {
                borderRadius: '8px',
                padding: '1rem'
              }
            }}
            backgroundColor="neutral-faded"
          >
            <View direction="column" gap={2}>
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <View key={item} direction="row" gap={2} align="center">
                  <Skeleton height="0.5rem" width="0.5rem" borderRadius="small" />
                  <Skeleton height="1rem" width={`${Math.random() * 40 + 60}%`} borderRadius="small" />
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Instructions Section */}
        <View direction="column" gap={2}>
          <Skeleton height="2rem" width="35%" borderRadius="small" />
          <View direction="column" gap={4}>
            {[1, 2, 3, 4, 5].map((step) => (
              <View key={step} direction="row" gap={2} align="start">
                {/* Step number */}
                <Skeleton height="2rem" width="2rem" borderRadius="large" />
                {/* Instruction text */}
                <View direction="column" gap={1} attributes={{ style: { flex: 1 } }}>
                  <Skeleton height="1rem" width="100%" borderRadius="small" />
                  <Skeleton height="1rem" width={`${Math.random() * 30 + 70}%`} borderRadius="small" />
                </View>
              </View>
            ))}
          </View>
        </View>

        <Divider />

        {/* Comments Section skeleton */}
        <View direction="column" gap={4}>
          <Skeleton height="2rem" width="40%" borderRadius="small" />
          
          {/* Comment form skeleton */}
          <View direction="column" gap={2}>
            <Skeleton height="6rem" width="100%" borderRadius="small" />
            <Skeleton height="2.5rem" width="8rem" borderRadius="small" />
          </View>
          
          {/* Existing comments skeleton */}
          {[1, 2, 3].map((comment) => (
            <View key={comment} direction="column" gap={2} padding={3} backgroundColor="neutral-faded" attributes={{ style: { borderRadius: '8px' } }}>
              <View direction="row" gap={2} align="center">
                <Skeleton height="2rem" width="2rem" borderRadius="large" />
                <View direction="column" gap={1}>
                  <Skeleton height="1rem" width="8rem" borderRadius="small" />
                  <Skeleton height="0.875rem" width="6rem" borderRadius="small" />
                </View>
              </View>
              <View direction="column" gap={1}>
                <Skeleton height="1rem" width="100%" borderRadius="small" />
                <Skeleton height="1rem" width={`${Math.random() * 40 + 60}%`} borderRadius="small" />
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}