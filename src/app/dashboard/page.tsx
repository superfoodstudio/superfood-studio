"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, Suspense } from "react";
import { QueryErrorBoundary } from '@/components/ui/QueryErrorBoundary';
import { View, Text, Button, Skeleton } from "reshaped";
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
      first: 2,
      sort: "newest",
    },
  );

  return (
    <View direction="row" gap={4}>
      {productsData?.productsConnection?.edges.map((edge, i) => (
        <View.Item key={i} columns={{ s: 12, m: 6 }}>
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
            <View direction="row" align="center" justify="space-between">
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
              <Link href="/shop">
                <Text
                  variant="body-2"
                  attributes={{
                    style: {
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    },
                  }}
                >
                  view shop
                </Text>
              </Link>
            </View>
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
      <View direction="column" gap={6}>
        {/* Hero Section Skeleton */}
        <View direction="column" align="center" gap={6} padding={8}>
          <View direction="column" align="center" gap={4}>
            <View direction="column" align="center" gap={2}>
              <Skeleton height="1.25rem" width="14rem" borderRadius="small" />
              <Skeleton height="1rem" width="20rem" borderRadius="small" />
            </View>
            <View direction={{ s: "column", m: "row" }} gap={3}>
              <Skeleton height="2.75rem" width="10rem" borderRadius="large" />
              <Skeleton height="2.75rem" width="10rem" borderRadius="large" />
            </View>
          </View>
        </View>

        {/* Featured Recipe Skeleton */}
        <View padding={4}>
          <Skeleton height="280px" width="100%" borderRadius="medium" />
        </View>

        {/* Latest Products Skeleton */}
        <View padding={4}>
          <View direction="column" gap={4}>
            <Skeleton height="1.25rem" width="10rem" borderRadius="small" />
            <View direction="row" gap={4}>
              <View attributes={{ style: { flex: 1 } }}>
                <Skeleton height="200px" width="100%" borderRadius="medium" />
              </View>
              <View attributes={{ style: { flex: 1 } }}>
                <Skeleton height="200px" width="100%" borderRadius="medium" />
              </View>
            </View>
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
    <QueryErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
