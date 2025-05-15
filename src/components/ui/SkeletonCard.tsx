'use client';

import { View, Skeleton } from 'reshaped';

export function SkeletonCard() {
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
        {/* Image skeleton */}
        <div style={{ aspectRatio: '16/9', width: '100%' }}>
          <Skeleton width="100%" height="100%" borderRadius="medium" />
        </div>
        
        {/* Title skeleton */}
        <Skeleton height="1.5rem" width="80%" borderRadius="small" />
        
        {/* Category skeleton */}
        <Skeleton height="1rem" width="50%" borderRadius="small" />
        
        {/* Description skeleton - two lines */}
        <View direction="column" gap={1}>
          <Skeleton height="0.875rem" width="100%" borderRadius="small" />
          <Skeleton height="0.875rem" width="90%" borderRadius="small" />
        </View>
        
        {/* Button skeleton */}
        <Skeleton height="2.5rem" width="100%" borderRadius="small" />
      </View>
    </View>
  );
} 