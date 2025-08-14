"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState, Suspense } from "react";
import { View, Text, Button, Card, Skeleton, Grid } from "reshaped";
import { useLazyLoadQuery } from "react-relay";
import { AppContainer } from "@/components/layout/AppContainer";
import { Calendar, ShoppingBag, Receipt } from "phosphor-react";
import { FeaturedRecipe } from "@/components/recipes/FeaturedRecipe";
import { CurrentUserQuery } from "@/graphql/queries/UserQueries";
import type { UserQueriesCurrentUserQuery } from "@/__generated__/UserQueriesCurrentUserQuery.graphql";

function DashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  const data = useLazyLoadQuery<UserQueriesCurrentUserQuery>(
    CurrentUserQuery,
    {}
  );

  const user = data.currentUser;
  const username =
    user?.firstName ||
    (user?.email ? user.email.split("@")[0] : null) ||
    "friend";

  return (
    <AppContainer>
      <View direction="column" gap={6} paddingTop={4}>
        {/* Navigation Component - Four-button tab bar */}
        <View
          direction="row"
          justify="center"
          paddingTop={4}
          paddingInline={4}
          gap={2}
        >
          <View width={{ s: "100%", m: "200px" }} maxWidth={"200px"}>
            <Button
              variant="outline"
              size="large"
              rounded={true}
              fullWidth={true}
              onClick={() => {
                setActiveTab("recipes");
                router.push("/recipes");
              }}
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
          </View>
          <View width={{ s: "100%", m: "200px" }} maxWidth={"200px"}>
            <Button
              variant="outline"
              size="large"
              rounded={true}
              fullWidth={true}
              onClick={() => {
                setActiveTab("shop");
                router.push("/shop");
              }}
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
                Shop
              </Text>
            </Button>
          </View>
          <View width={{ s: "100%", m: "200px" }} maxWidth={"200px"}>
            <Button
              variant="outline"
              size="large"
              rounded={true}
              fullWidth={true}
              onClick={() => {
                setActiveTab("orders");
                router.push("/dashboard/orders");
              }}
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
                {" "}
                Orders
              </Text>
            </Button>
          </View>
          <View width={{ s: "100%", m: "200px" }} maxWidth={"200px"}>
            <Button
              variant="outline"
              size="large"
              rounded={true}
              fullWidth={true}
              onClick={() => {
                setActiveTab("membership");
                router.push("/dashboard/membership");
              }}
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
                {" "}
                Membership
              </Text>
            </Button>
          </View>
        </View>

        {/* Hero Section with Coconut Image */}
        <View
          direction={{ s: "column", m: "row" }}
          align="center"
          gap={6}
          padding={8}
        >
          {/* Content Section */}
          <View
            direction="column"
            gap={4}
            align={{ s: "center", m: "start" }}
            attributes={{ style: { flex: 1 } }}
          >
            <Text
              variant="body-2"
              align={{ s: "center", m: "start" }}
              attributes={{
                style: {
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "14px",
                  fontWeight: "600",
                },
              }}
            >
              THIS WEEKS RECIPES
            </Text>

            <Text
              color="neutral-faded"
              align={{ s: "center", m: "start" }}
              attributes={{
                style: {
                  lineHeight: "1.6",
                  fontSize: "16px",
                },
              }}
            >
              a curated collection of recipes and step by step tutorials
            </Text>

            <View
              direction={{ s: "column", m: "row" }}
              gap={3}
              attributes={{ style: { marginTop: "16px", width: "100%" } }}
            >
              <Button
                variant="solid"
                size="large"
                onClick={() => router.push("/dashboard/grocery-list")}
                attributes={{
                  style: {
                    backgroundColor: "#6b4c7a",
                    borderRadius: "25px",
                    padding: "12px 32px",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  },
                }}
              >
                GET GROCERY LIST
              </Button>
            </View>
          </View>
        </View>

        {/* Featured Recipe */}
        <View padding={4}>
          <View direction="column" gap={3} paddingBottom={2}>
            <Text
              variant="title-3"
              attributes={{
                style: {
                  fontFamily: "var(--font-big-caslon)",
                  textTransform: "lowercase",
                },
              }}
            >
              featured recipe
            </Text>
            <Text variant="body-2" color="neutral-faded">
              Discover this week's highlighted superfood creation
            </Text>
          </View>
          <FeaturedRecipe />
        </View>

        {/* Featured Sections */}
        <View direction="column" gap={6} padding={4}>
          {/* Membership Status Card */}
          <Card
            padding={6}
            attributes={{
              style: {
                backgroundColor: "#FEF7E6",
                border: "1px solid #F5D565",
                borderRadius: "12px",
              },
            }}
          >
            <View direction="row" justify="space-between" align="center">
              <View direction="column" gap={2}>
                <Text
                  variant="title-4"
                  attributes={{
                    style: {
                      fontFamily: "var(--font-big-caslon)",
                      textTransform: "lowercase",
                    },
                  }}
                >
                  membership status
                </Text>
                <View direction="row" align="center" gap={2}>
                  <Calendar size={16} />
                  <Text variant="body-2" color="neutral-faded">
                    Active • Premium access
                  </Text>
                </View>
                <Text variant="body-2" color="neutral">
                  Access premium recipes, personalized recommendations, and
                  priority support.
                </Text>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => router.push("/dashboard/membership")}
                  attributes={{
                    style: {
                      marginTop: "8px",
                      width: "fit-content",
                      borderRadius: "15px",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  MANAGE
                </Button>
              </View>
              <View
                width="80px"
                height="80px"
                borderRadius="circular"
                backgroundColor="primary"
                attributes={{
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  },
                }}
              >
                <ShoppingBag size={32} color="white" />
              </View>
            </View>
          </Card>

          {/* Quick Actions Grid */}
          <View direction="row" gap={4}>
            <Card
              padding={4}
              attributes={{
                style: {
                  flex: 1,
                  textAlign: "center",
                  cursor: "pointer",
                },
              }}
              onClick={() => router.push("/dashboard/orders")}
            >
              <View direction="column" align="center" gap={3}>
                <Receipt size={24} />
                <Text variant="featured-3">order history</Text>
                <Text variant="body-2" color="neutral-faded">
                  View your past purchases
                </Text>
                <Button
                  variant="outline"
                  size="small"
                  attributes={{
                    style: {
                      borderRadius: "15px",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  VIEW
                </Button>
              </View>
            </Card>

            <Card
              padding={4}
              attributes={{
                style: {
                  flex: 1,
                  textAlign: "center",
                  cursor: "pointer",
                },
              }}
              onClick={() => router.push("/shop")}
            >
              <View direction="column" align="center" gap={3}>
                <ShoppingBag size={24} />
                <Text variant="featured-3">shop superfoods</Text>
                <Text variant="body-2" color="neutral-faded">
                  Discover premium products
                </Text>
                <Button
                  variant="solid"
                  size="small"
                  attributes={{
                    style: {
                      borderRadius: "15px",
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  SHOP
                </Button>
              </View>
            </Card>
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
