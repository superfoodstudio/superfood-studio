"use client";

import { View, Text, Button, Grid, Card } from "reshaped";
import Link from "next/link";
import { useLazyLoadQuery } from "react-relay";
import { Suspense } from "react";
import type { AdminQueriesQuery } from "@/__generated__/AdminQueriesQuery.graphql";
import { AdminDashboardQuery } from './AdminQueries';

function AdminDashboardContent() {
  const data = useLazyLoadQuery<AdminQueriesQuery>(AdminDashboardQuery, {});

  // Handle case where adminMetrics might be null/undefined
  const metrics = data.adminMetrics || {
    totalOrders: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
    pendingOrders: 0,
  };

  const orders = data.recentOrders || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatStatus = (status: string) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <View
      direction="column"
      gap={10}
      padding={10}
      attributes={{
        style: {
          backgroundColor: "#f5f3f0",
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
        {/* Admin Section */}
        <View direction="column" gap={6}>
          <Text
            variant="featured-2"
            weight="bold"
            attributes={{
              style: {
                color: "#8a8a8a",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "1.2px",
              },
            }}
          >
            ADMIN
          </Text>

          {/* Admin Navigation Grid */}
          <Grid columns={{ s: "1fr 1fr 1fr", m: "repeat(3, 180px)" }} gap={4}>
            <Link href="/admin/recipes">
              <Button
                variant="outline"
                size="medium"
                attributes={{
                  style: {
                    width: "180px",
                    height: "45px",
                    border: "1px solid #6b4c7a",
                    backgroundColor: "#ffffff",
                    color: "#6b4c7a",
                    fontSize: "11px",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    borderRadius: "2px",
                  },
                }}
              >
                MANAGE RECIPES
              </Button>
            </Link>

            <Link href="/admin/products">
              <Button
                variant="outline"
                size="medium"
                attributes={{
                  style: {
                    width: "180px",
                    height: "45px",
                    border: "1px solid #6b4c7a",
                    backgroundColor: "#ffffff",
                    color: "#6b4c7a",
                    fontSize: "11px",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    borderRadius: "2px",
                  },
                }}
              >
                MANAGE PRODUCTS
              </Button>
            </Link>

            <Link href="/admin/orders">
              <Button
                variant="outline"
                size="medium"
                attributes={{
                  style: {
                    width: "180px",
                    height: "45px",
                    border: "1px solid #6b4c7a",
                    backgroundColor: "#ffffff",
                    color: "#6b4c7a",
                    fontSize: "11px",
                    fontWeight: "500",
                    letterSpacing: "0.5px",
                    borderRadius: "2px",
                  },
                }}
              >
                MANAGE ORDERS
              </Button>
            </Link>

            <Button
              variant="outline"
              size="medium"
              disabled
              attributes={{
                style: {
                  width: "180px",
                  height: "45px",
                  border: "1px solid #6b4c7a",
                  backgroundColor: "#ffffff",
                  color: "#6b4c7a",
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  borderRadius: "2px",
                  opacity: 0.5,
                },
              }}
            >
              SUBSCRIPTIONS
            </Button>

            <Button
              variant="outline"
              size="medium"
              disabled
              attributes={{
                style: {
                  width: "180px",
                  height: "45px",
                  border: "1px solid #6b4c7a",
                  backgroundColor: "#ffffff",
                  color: "#6b4c7a",
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  borderRadius: "2px",
                  opacity: 0.5,
                },
              }}
            >
              ANALYTICS
            </Button>

            <Button
              variant="outline"
              size="medium"
              disabled
              attributes={{
                style: {
                  width: "180px",
                  height: "45px",
                  border: "1px solid #6b4c7a",
                  backgroundColor: "#ffffff",
                  color: "#6b4c7a",
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "0.5px",
                  borderRadius: "2px",
                  opacity: 0.5,
                },
              }}
            >
              CUSTOMERS
            </Button>
          </Grid>
        </View>

        {/* Metrics Cards */}
        <View direction="row" gap={5} justify="start">
          {/* Orders Card */}
          <Card
            padding={4}
            attributes={{
              style: {
                width: "120px",
                height: "100px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0ddd8",
                borderRadius: "2px",
              },
            }}
          >
            <View
              direction="column"
              align="center"
              justify="center"
              height="100%"
            >
              <Text
                attributes={{
                  style: {
                    fontSize: "32px",
                    fontWeight: "300",
                    color: "#4a4a4a",
                    lineHeight: 1,
                  },
                }}
              >
                {metrics.totalOrders}
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "#4a4a4a",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  },
                }}
              >
                ORDERS
              </Text>
            </View>
          </Card>

          {/* Revenue Card */}
          <Card
            padding={4}
            attributes={{
              style: {
                width: "120px",
                height: "100px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0ddd8",
                borderRadius: "2px",
              },
            }}
          >
            <View
              direction="column"
              align="center"
              justify="center"
              height="100%"
            >
              <Text
                attributes={{
                  style: {
                    fontSize: "32px",
                    fontWeight: "300",
                    color: "#4a4a4a",
                    lineHeight: 1,
                  },
                }}
              >
                $
                {metrics.totalRevenue >= 1000
                  ? (metrics.totalRevenue / 1000).toFixed(0) + "K"
                  : metrics.totalRevenue.toFixed(0)}
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "#4a4a4a",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  },
                }}
              >
                REVENUE
              </Text>
            </View>
          </Card>

          {/* Subscribers Card */}
          <Card
            padding={4}
            attributes={{
              style: {
                width: "120px",
                height: "100px",
                backgroundColor: "#ffffff",
                border: "1px solid #e0ddd8",
                borderRadius: "2px",
              },
            }}
          >
            <View
              direction="column"
              align="center"
              justify="center"
              height="100%"
            >
              <Text
                attributes={{
                  style: {
                    fontSize: "32px",
                    fontWeight: "300",
                    color: "#4a4a4a",
                    lineHeight: 1,
                  },
                }}
              >
                {metrics.activeSubscriptions}
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "#4a4a4a",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  },
                }}
              >
                SUBSCRIBERS
              </Text>
            </View>
          </Card>

          {/* Pending Orders Card */}
          <Card
            padding={4}
            attributes={{
              style: {
                width: "140px",
                height: "100px",
                backgroundColor: "#6b4c7a",
                borderRadius: "2px",
              },
            }}
          >
            <View
              direction="column"
              align="center"
              justify="center"
              height="100%"
            >
              <Text
                attributes={{
                  style: {
                    fontSize: "32px",
                    fontWeight: "300",
                    color: "#ffffff",
                    lineHeight: 1,
                  },
                }}
              >
                {metrics.pendingOrders}
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: "10px",
                    fontWeight: "500",
                    color: "#ffffff",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                  },
                }}
              >
                PENDING
              </Text>
            </View>
          </Card>
        </View>

        {/* Orders Table Section */}
        <View direction="column" gap={5}>
          <Text
            variant="featured-2"
            weight="bold"
            attributes={{
              style: {
                color: "#8a8a8a",
                fontSize: "14px",
                fontWeight: "600",
                letterSpacing: "1.2px",
              },
            }}
          >
            MANAGE ORDERS
          </Text>

          {/* Orders Table */}
          <View
            attributes={{
              style: {
                border: "1px solid #e0ddd8",
                backgroundColor: "#ffffff",
                borderRadius: "2px",
              },
            }}
          >
            {/* Table Header */}
            <View
              direction="row"
              padding={6}
              attributes={{
                style: {
                  height: "50px",
                  backgroundColor: "#f9f8f6",
                  borderBottom: "1px solid #e0ddd8",
                },
              }}
            >
              <View width="25%">
                <Text
                  attributes={{
                    style: {
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#8a8a8a",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  INVOICE
                </Text>
              </View>
              <View width="35%">
                <Text
                  attributes={{
                    style: {
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#8a8a8a",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  DATE
                </Text>
              </View>
              <View width="40%">
                <Text
                  attributes={{
                    style: {
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#8a8a8a",
                      letterSpacing: "0.5px",
                    },
                  }}
                >
                  STATUS
                </Text>
              </View>
            </View>

            {/* Table Rows */}
            {orders.length === 0 ? (
              <View
                direction="row"
                padding={6}
                align="center"
                justify="center"
                attributes={{
                  style: {
                    height: "45px",
                    backgroundColor: "#ffffff",
                  },
                }}
              >
                <Text
                  attributes={{
                    style: {
                      fontSize: "13px",
                      fontWeight: "400",
                      color: "#8a8a8a",
                    },
                  }}
                >
                  No recent orders
                </Text>
              </View>
            ) : (
              orders.map((order, index) => (
                <View
                  key={order.id}
                  direction="row"
                  padding={6}
                  attributes={{
                    style: {
                      height: "45px",
                      backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafaf9",
                      borderBottom:
                        index < orders.length - 1
                          ? "1px solid #f0efec"
                          : "none",
                    },
                  }}
                >
                  <View width="25%">
                    <Text
                      attributes={{
                        style: {
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "#4a4a4a",
                        },
                      }}
                    >
                      #{order.id.slice(0, 8)}
                    </Text>
                  </View>
                  <View width="35%">
                    <Text
                      attributes={{
                        style: {
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "#4a4a4a",
                        },
                      }}
                    >
                      {formatDate(order.date)}
                    </Text>
                  </View>
                  <View width="40%">
                    <Text
                      attributes={{
                        style: {
                          fontSize: "13px",
                          fontWeight: "400",
                          color: "#4a4a4a",
                        },
                      }}
                    >
                      {formatStatus(order.status)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* See All Orders Link */}
          <View align="center" paddingTop={6}>
            <Link href="/admin/orders">
              <Text
                attributes={{
                  style: {
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#6b4c7a",
                    letterSpacing: "0.5px",
                    cursor: "pointer",
                  },
                }}
              >
                SEE ALL ORDERS
              </Text>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

function LoadingFallback() {
  return (
    <View
      direction="column"
      align="center"
      justify="center"
      height="100vh"
      attributes={{
        style: {
          backgroundColor: "#f5f3f0",
        },
      }}
    >
      <Text>Loading admin dashboard...</Text>
    </View>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminDashboardContent />
    </Suspense>
  );
}
