import { View, Skeleton, Grid } from "reshaped";

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
            maxWidth: '1200px',
            margin: '0 auto'
          }
        }}
      >
        {/* Admin Section Skeleton */}
        <View direction="column" gap={6}>
          <Skeleton height="1rem" width="4rem" />

          {/* Admin Navigation Grid Skeleton */}
          <Grid columns={{ s: "1fr 1fr 1fr", m: "repeat(3, 180px)" }} gap={4}>
            <Skeleton height="45px" width="180px" borderRadius="small" />
            <Skeleton height="45px" width="180px" borderRadius="small" />
            <Skeleton height="45px" width="180px" borderRadius="small" />
            <Skeleton height="45px" width="180px" borderRadius="small" />
          </Grid>
        </View>

        {/* Metrics Cards Skeleton */}
        <View direction="row" gap={5} justify="start">
          <Skeleton height="100px" width="120px" borderRadius="small" />
          <Skeleton height="100px" width="120px" borderRadius="small" />
          <Skeleton height="100px" width="120px" borderRadius="small" />
          <Skeleton height="100px" width="140px" borderRadius="small" />
        </View>

        {/* Orders Table Section Skeleton */}
        <View direction="column" gap={5}>
          <Skeleton height="1rem" width="8rem" />

          {/* Orders Table Skeleton */}
          <View direction="column" gap={0}>
            {/* Table Header Skeleton */}
            <Skeleton height="50px" width="100%" borderRadius="small" />
            
            {/* Table Rows Skeleton */}
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} height="45px" width="100%" />
            ))}
          </View>

          {/* See All Orders Link Skeleton */}
          <View align="center" paddingTop={6}>
            <Skeleton height="0.75rem" width="6rem" />
          </View>
        </View>
      </View>
    </View>
  );
}