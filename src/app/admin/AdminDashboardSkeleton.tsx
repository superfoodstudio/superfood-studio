import { View, Skeleton } from "reshaped";

export function AdminDashboardSkeleton() {
  return (
    <View
      direction="column"
      gap={10}
      padding={10}
      attributes={{
        style: {
          minHeight: "100vh",
        },
      }}
    >
      <View
        direction="column"
        gap={10}
        width="100%"
        attributes={{
          style: {
            maxWidth: '900px',
            margin: '0 auto'
          }
        }}
      >
        {/* Admin label */}
        <Skeleton height="1rem" width="4rem" />

        {/* Nav buttons */}
        <View direction="row" gap={4} wrap>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="40px" width="140px" borderRadius="medium" />
          ))}
        </View>

        {/* Metrics cards */}
        <View direction="row" gap={5} wrap>
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height="90px" width="120px" borderRadius="small" />
          ))}
        </View>

        {/* Latest orders label */}
        <Skeleton height="1rem" width="8rem" />

        {/* Table placeholder */}
        <View direction="column" gap={3}>
          <Skeleton height="2.5rem" width="100%" borderRadius="small" />
          <Skeleton height="2.5rem" width="100%" borderRadius="small" />
          <Skeleton height="2.5rem" width="100%" borderRadius="small" />
        </View>
      </View>
    </View>
  );
}
