'use client';

import { Button, View } from 'reshaped';

interface PaginationProps {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  onLoadPrevious: () => void;
}

export default function Pagination({
  hasNextPage,
  hasPreviousPage,
  isLoading,
  onLoadMore,
  onLoadPrevious
}: PaginationProps) {
  return (
    <View direction="row" gap={2} justify="center" padding={4}>
      {hasPreviousPage && (
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={onLoadPrevious}
        >
          Previous
        </Button>
      )}
      
      {hasNextPage && (
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={onLoadMore}
        >
          Load More
        </Button>
      )}
    </View>
  );
} 