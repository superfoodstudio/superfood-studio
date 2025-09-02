'use client';

import { useInView } from 'react-intersection-observer';
import { View, Text } from 'reshaped';
import { useEffect } from 'react';

interface LoadMoreProps {
  hasNext: boolean;
  isLoadingNext: boolean;
  onLoadMore: () => void;
}

export function LoadMore({ hasNext, isLoadingNext, onLoadMore }: LoadMoreProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && hasNext && !isLoadingNext) {
      onLoadMore();
    }
  }, [inView, hasNext, isLoadingNext, onLoadMore]);

  if (!hasNext) return null;

  return (
    <View 
      padding={4} 
      align="center"
      attributes={{
        ref,
        style: { minHeight: '60px' }
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