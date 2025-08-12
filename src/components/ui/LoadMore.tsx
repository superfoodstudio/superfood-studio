'use client';

import React, { useEffect, useRef } from 'react';
import { View, Text } from 'reshaped';

interface LoadMoreProps {
  hasNext: boolean;
  isLoadingNext: boolean;
  onLoadMore: () => void;
  threshold?: number; // How close to the element before triggering (0-1)
  rootMargin?: string; // CSS margin for the intersection observer root
}

export function LoadMore({ 
  hasNext, 
  isLoadingNext, 
  onLoadMore, 
  threshold = 0.1,
  rootMargin = '100px' 
}: LoadMoreProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasNext || isLoadingNext) return;

    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !isLoadingNext) {
          onLoadMore();
        }
      },
      { 
        threshold,
        rootMargin 
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNext, isLoadingNext, onLoadMore, threshold, rootMargin]);

  // Don't render anything if there's no more content
  if (!hasNext) return null;

  return (
    <View 
      padding={4} 
      align="center"
      attributes={{
        ref: loadMoreRef,
        style: {
          minHeight: '60px' // Ensure it's tall enough to intersect
        }
      }}
    >
      {isLoadingNext ? (
        <View direction="row" align="center" gap={2}>
          <div 
            style={{
              width: '20px',
              height: '20px',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '50%',
              borderTopColor: '#2E1A47',
              animation: 'spin 1s linear infinite'
            }} 
          />
          <Text variant="body-2" color="neutral-faded">
            Loading more...
          </Text>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </View>
      ) : (
        <Text variant="body-2" color="neutral-faded">
          Scroll for more
        </Text>
      )}
    </View>
  );
}