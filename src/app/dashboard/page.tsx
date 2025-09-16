"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, Suspense } from "react";
import { View, Text, Button, Card, Skeleton, Grid } from "reshaped";
import { useLazyLoadQuery } from "react-relay";
import { AppContainer } from "@/components/layout/AppContainer";
import { FeaturedRecipe } from "@/components/recipes/FeaturedRecipe";
import { WeeklyGroceryList } from "@/components/dashboard/WeeklyGroceryList";
import { ProductCard } from "@/components/products/ProductCard";
import { StarRating } from "@/components/ratings/StarRating";
import { CurrentUserQuery } from "@/graphql/queries/UserQueries";
import { ProductsConnectionQuery } from "@/graphql/queries/ProductQueries";
import type { UserQueriesCurrentUserQuery } from "@/__generated__/UserQueriesCurrentUserQuery.graphql";
import type { ProductQueriesProductsConnectionQuery } from "@/__generated__/ProductQueriesProductsConnectionQuery.graphql";

function LatestProducts() {
  const productsData = useLazyLoadQuery<ProductQueriesProductsConnectionQuery>(
    ProductsConnectionQuery,
    {
      first: 3,
      sort: "newest",
    },
  );

  return (
    <View direction="row" gap={4}>
      {productsData.productsConnection.edges.map((edge, i) => (
        <View.Item key={i} columns={{ s: 12, m: 4 }}>
          <ProductCard product={edge.node} />
        </View.Item>
      ))}
    </View>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  const data = useLazyLoadQuery<UserQueriesCurrentUserQuery>(
    CurrentUserQuery,
    {},
  );

  const user = data.currentUser;
  const username =
    user?.firstName ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "friend";

  return (
    <AppContainer>
      <View direction="column" gap={6}>
        {/* Hero Section */}
        <View direction="column" align="center" gap={6} padding={8}>
          {/* Content Section */}
          <View direction="column" align="center" gap={4}>
            <View direction="column">
              <Text
                variant="featured-2"
                align="center"
                attributes={{
                  style: {
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontWeight: "600",
                  },
                }}
              >
                THIS WEEKS RECIPES
              </Text>

              <Text
                color="neutral-faded"
                align="start"
                attributes={{
                  style: {
                    lineHeight: "1.6",
                    fontSize: "16px",
                  },
                }}
              >
                a curated collection of recipes and step by step tutorials
              </Text>
            </View>

            <View direction={{ s: "column", m: "row" }} gap={3}>
              <Button
                variant="outline"
                size="large"
                rounded={true}
                fullWidth={{ s: true, m: false }}
                onClick={() => {
                  setActiveTab("recipes");
                  router.push("/recipes");
                }}
                attributes={{ style: { minWidth: "150px" } }}
              >
                <Text
                  variant="body-2"
                  attributes={{
                    style: {
                      fontWeight: 300,
                      color: "var(--rs-color-forest-green)",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-midruns-sans)",
                      letterSpacing: "1.2px",
                    },
                  }}
                >
                  Recipes
                </Text>
              </Button>
              <WeeklyGroceryList />
            </View>
          </View>
        </View>

        {/* Featured Recipe */}
        <View padding={4}>
          <FeaturedRecipe />
        </View>

        {/* Latest Products */}
        <View padding={4}>
          <View direction="column" gap={4}>
            <Text
              variant="featured-1"
              attributes={{
                style: {
                  fontFamily: "var(--font-big-caslon)",
                  textTransform: "lowercase",
                },
              }}
            >
              latest products
            </Text>
            <LatestProducts />
          </View>
        </View>
      </View>
    </AppContainer>
  );
}

function DashboardSkeleton() {
  return (
    <AppContainer>
      <View direction="column" gap={6} paddingTop={4}>
        {/* Navigation Skeleton */}
        <View
          direction="row"
          justify="center"
          gap={2}
          paddingTop={4}
          paddingInline={4}
        >
          <Skeleton
            height="3rem"
            borderRadius="medium"
            attributes={{ style: { flex: 1, minWidth: "120px" } }}
          />
          <Skeleton
            height="3rem"
            borderRadius="medium"
            attributes={{ style: { flex: 1, minWidth: "120px" } }}
          />
          <Skeleton
            height="3rem"
            borderRadius="medium"
            attributes={{ style: { flex: 1, minWidth: "120px" } }}
          />
          <Skeleton
            height="3rem"
            borderRadius="medium"
            attributes={{ style: { flex: 1, minWidth: "120px" } }}
          />
        </View>

        {/* Hero Section Skeleton */}
        <View
          direction={{ s: "column", m: "row" }}
          align="center"
          gap={6}
          padding={8}
        >
          {/* Coconut Image Skeleton */}
          <Skeleton
            width="280px"
            height="280px"
            borderRadius="circular"
            attributes={{ style: { flexShrink: 0 } }}
          />

          {/* Content Section Skeleton */}
          <View
            direction="column"
            gap={4}
            align={{ s: "center", m: "start" }}
            attributes={{ style: { flex: 1 } }}
          >
            <Skeleton height="1rem" width="60%" />
            <Skeleton height="1.25rem" width="90%" />
            <View
              direction={{ s: "column", m: "row" }}
              gap={3}
              attributes={{ style: { marginTop: "16px", width: "100%" } }}
            >
              <Skeleton height="3rem" width="8rem" borderRadius="large" />
              <Skeleton height="3rem" width="10rem" borderRadius="large" />
            </View>
          </View>
        </View>

        {/* Featured Recipe Section Skeleton */}
        <View padding={4}>
          <View direction="column" gap={3} paddingBottom={2}>
            <Skeleton height="1.5rem" width="10rem" />
            <Skeleton height="1rem" width="15rem" />
          </View>
          <Card padding={4}>
            <View direction="row" gap={4} height="200px">
              <Skeleton width="40%" height="100%" borderRadius="large" />
              <View
                direction="column"
                gap={3}
                padding={4}
                attributes={{ style: { flex: 1 } }}
              >
                <Skeleton height="1rem" width="4rem" borderRadius="small" />
                <Skeleton height="1.5rem" width="80%" />
                <Skeleton height="1rem" width="100%" />
                <View direction="row" justify="space-between" align="center">
                  <Skeleton height="0.75rem" width="5rem" />
                  <Skeleton height="2rem" width="6rem" borderRadius="medium" />
                </View>
              </View>
            </View>
          </Card>
        </View>

        {/* Cards Section Skeleton */}
        <View direction="column" gap={6} padding={4}>
          <Card padding={6}>
            <View direction="row" justify="space-between" align="center">
              <View
                direction="column"
                gap={2}
                attributes={{ style: { flex: 1 } }}
              >
                <Skeleton height="1.5rem" width="10rem" />
                <Skeleton height="1rem" width="8rem" />
                <Skeleton height="1rem" width="100%" />
                <Skeleton
                  height="2rem"
                  width="5rem"
                  borderRadius="medium"
                  attributes={{ style: { marginTop: "8px" } }}
                />
              </View>
              <Skeleton
                width="80px"
                height="80px"
                borderRadius="circular"
                attributes={{ style: { flexShrink: 0 } }}
              />
            </View>
          </Card>

          <View direction="row" gap={4}>
            <Card padding={4} attributes={{ style: { flex: 1 } }}>
              <View direction="column" align="center" gap={3}>
                <Skeleton width="24px" height="24px" />
                <Skeleton height="1.25rem" width="6rem" />
                <Skeleton height="1rem" width="80%" />
                <Skeleton height="2rem" width="4rem" borderRadius="medium" />
              </View>
            </Card>

            <Card padding={4} attributes={{ style: { flex: 1 } }}>
              <View direction="column" align="center" gap={3}>
                <Skeleton width="24px" height="24px" />
                <Skeleton height="1.25rem" width="7rem" />
                <Skeleton height="1rem" width="80%" />
                <Skeleton height="2rem" width="4rem" borderRadius="medium" />
              </View>
            </Card>
          </View>
        </View>
      </View>
    </AppContainer>
  );
}

function LoadingFallback() {
  return <DashboardSkeleton />;
}

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return <LoadingFallback />;
  }

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
