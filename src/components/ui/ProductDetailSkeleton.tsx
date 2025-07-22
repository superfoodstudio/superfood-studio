'use client';

import { View, Skeleton, Divider } from 'reshaped';

export function ProductDetailSkeleton() {
  return (
    <View direction="column" gap={6}>
      {/* Back button skeleton */}
      <Skeleton height="2rem" width="4rem" borderRadius="small" />
      
      {/* Main content - responsive layout */}
      <View 
        attributes={{
          style: { 
            display: 'flex',
            flexDirection: 'row',
            gap: '1.5rem',
            flexWrap: 'wrap'
          }
        }}
      >
        {/* Product Image skeleton */}
        <View 
          attributes={{
            style: {
              width: '100%',
              maxWidth: '500px',
              height: '400px'
            }
          }}
        >
          <Skeleton width="100%" height="100%" borderRadius="medium" />
        </View>
        
        {/* Product Details skeleton */}
        <View direction="column" gap={4} attributes={{ style: { flex: '1', minWidth: '300px' } }}>
          {/* Title and price */}
          <View direction="column" gap={2}>
            <Skeleton height="2.5rem" width="85%" borderRadius="small" />
            <Skeleton height="2rem" width="30%" borderRadius="small" />
            <Skeleton height="1rem" width="40%" borderRadius="small" />
          </View>
          
          <Divider />
          
          {/* Description */}
          <View direction="column" gap={1}>
            <Skeleton height="1rem" width="100%" borderRadius="small" />
            <Skeleton height="1rem" width="95%" borderRadius="small" />
            <Skeleton height="1rem" width="80%" borderRadius="small" />
          </View>
          
          {/* Rating section */}
          <View direction="column" gap={2}>
            <Skeleton height="1.5rem" width="60%" borderRadius="small" />
            <View direction="row" gap={1}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Skeleton key={star} height="1.5rem" width="1.5rem" borderRadius="small" />
              ))}
            </View>
            <Skeleton height="1rem" width="50%" borderRadius="small" />
          </View>
          
          {/* Tags skeleton */}
          <View direction="row" gap={2} wrap>
            <Skeleton height="1.5rem" width="4rem" borderRadius="small" />
            <Skeleton height="1.5rem" width="3rem" borderRadius="small" />
            <Skeleton height="1.5rem" width="5rem" borderRadius="small" />
          </View>
          
          {/* Add to cart button and inventory */}
          <View direction="column" gap={2}>
            <Skeleton height="3rem" width="100%" borderRadius="small" />
            <Skeleton height="1rem" width="60%" borderRadius="small" />
          </View>
        </View>
      </View>
      
      {/* Video section skeleton (optional) */}
      <View direction="column" gap={2} attributes={{ style: { marginTop: '2rem' } }}>
        <Skeleton height="1.5rem" width="30%" borderRadius="small" />
        <View
          attributes={{
            style: {
              width: '100%',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              position: 'relative'
            }
          }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
            <Skeleton width="100%" height="100%" borderRadius="medium" />
          </div>
        </View>
      </View>
    </View>
  );
}