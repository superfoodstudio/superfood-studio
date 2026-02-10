'use client';

import { View, Skeleton } from 'reshaped';

interface ListSkeletonProps {
  rows?: number;
  columns?: number;
}

export function ListSkeleton({ rows = 5, columns = 4 }: ListSkeletonProps) {
  return (
    <View direction="column" gap={3}>
      {/* Header row */}
      <View
        direction="row"
        gap={6}
        padding={4}
        attributes={{
          style: {
            borderBottom: '1px solid var(--rs-color-border-neutral-faded)',
          }
        }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <View key={i} attributes={{ style: { flex: i === 0 ? 2 : 1 } }}>
            <Skeleton height="1rem" width="60%" borderRadius="small" />
          </View>
        ))}
      </View>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <View
          key={row}
          direction="row"
          gap={6}
          padding={4}
          attributes={{
            style: {
              borderBottom: '1px solid var(--rs-color-border-neutral-faded)',
            }
          }}
        >
          {Array.from({ length: columns }).map((_, col) => (
            <View key={col} attributes={{ style: { flex: col === 0 ? 2 : 1 } }}>
              <Skeleton height="1rem" width={col === 0 ? '80%' : '60%'} borderRadius="small" />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export function FormSkeleton() {
  return (
    <View direction="column" gap={6} padding={4}>
      {/* Title */}
      <Skeleton height="2rem" width="40%" borderRadius="small" />
      {/* Form fields */}
      {[1, 2, 3, 4].map((i) => (
        <View key={i} direction="column" gap={2}>
          <Skeleton height="1rem" width="20%" borderRadius="small" />
          <Skeleton height="2.5rem" width="100%" borderRadius="small" />
        </View>
      ))}
      {/* Submit button */}
      <Skeleton height="2.5rem" width="8rem" borderRadius="small" />
    </View>
  );
}

export function ContentSkeleton() {
  return (
    <View direction="column" gap={4} padding={4}>
      <Skeleton height="2rem" width="50%" borderRadius="small" />
      <View direction="column" gap={2}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} direction="row" justify="space-between">
            <Skeleton height="1rem" width="30%" borderRadius="small" />
            <Skeleton height="1rem" width="40%" borderRadius="small" />
          </View>
        ))}
      </View>
      <Skeleton height="1px" width="100%" />
      <View direction="column" gap={2}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height="1rem" width={`${90 - i * 10}%`} borderRadius="small" />
        ))}
      </View>
    </View>
  );
}
