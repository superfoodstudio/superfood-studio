'use client';

import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { View, Text, Button, Card } from 'reshaped';
import { AppContainer } from '@/components/layout/AppContainer';
import { Calendar, ShoppingBag, Receipt } from 'phosphor-react';
import { FeaturedRecipe } from '@/components/recipes/FeaturedRecipe';

function DashboardContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <AppContainer>
      <View direction="column" gap={6} paddingTop={4}>
        {/* Navigation Component - Three-button tab bar */}
        <View direction="row" justify="center" gap={2} paddingTop={4}>
          <Button
            variant={activeTab === 'recipes' ? 'solid' : 'outline'}
            onClick={() => {
              setActiveTab('recipes');
              router.push('/recipes');
            }}
            attributes={{
              style: {
                borderRadius: '20px',
                padding: '8px 24px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }
            }}
          >
            RECIPES
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'solid' : 'outline'}
            onClick={() => {
              setActiveTab('orders');
              router.push('/dashboard/orders');
            }}
            attributes={{
              style: {
                borderRadius: '20px',
                padding: '8px 24px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }
            }}
          >
            ORDERS
          </Button>
          <Button
            variant={activeTab === 'shop' ? 'solid' : 'outline'}
            onClick={() => {
              setActiveTab('shop');
              router.push('/shop');
            }}
            attributes={{
              style: {
                borderRadius: '20px',
                padding: '8px 24px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }
            }}
          >
            SHOP
          </Button>
        </View>

        {/* Hero Section */}
        <View direction="column" align="center" gap={4} padding={8}>
          <View
            width="64px"
            height="64px"
            borderRadius="circular"
            backgroundColor="primary"
            attributes={{
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }
            }}
          >
            <Calendar size={32} color="white" />
          </View>
          
          <Text 
            variant="title-1" 
            align="center"
            attributes={{
              style: {
                fontFamily: 'var(--font-big-caslon)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }
            }}
          >
            YOUR WEEKLY DASHBOARD
          </Text>
          
          <Text 
            align="center" 
            color="neutral-faded"
            attributes={{
              style: {
                maxWidth: '400px',
                lineHeight: '1.6'
              }
            }}
          >
            Manage your superfood journey with personalized recommendations, track your orders, and explore premium recipes curated just for you.
          </Text>
          
          <Button
            variant="solid"
            size="large"
            onClick={() => router.push('/dashboard/membership')}
            attributes={{
              style: {
                marginTop: '16px',
                backgroundColor: '#6b4c7a',
                borderRadius: '25px',
                padding: '12px 32px',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }
            }}
          >
            MANAGE MEMBERSHIP
          </Button>
        </View>

        {/* Featured Recipe */}
        <View padding={4}>
          <View direction="column" gap={3} paddingBottom={2}>
            <Text 
              variant="title-3"
              attributes={{
                style: {
                  fontFamily: 'var(--font-big-caslon)',
                  textTransform: 'lowercase'
                }
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
                backgroundColor: '#FEF7E6',
                border: '1px solid #F5D565',
                borderRadius: '12px'
              }
            }}
          >
            <View direction="row" justify="space-between" align="center">
              <View direction="column" gap={2}>
                <Text 
                  variant="title-4"
                  attributes={{
                    style: {
                      fontFamily: 'var(--font-big-caslon)',
                      textTransform: 'lowercase'
                    }
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
                  Access premium recipes, personalized recommendations, and priority support.
                </Text>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => router.push('/dashboard/membership')}
                  attributes={{
                    style: {
                      marginTop: '8px',
                      width: 'fit-content',
                      borderRadius: '15px',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }
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
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }
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
                  textAlign: 'center',
                  cursor: 'pointer'
                }
              }}
              onClick={() => router.push('/dashboard/orders')}
            >
              <View direction="column" align="center" gap={3}>
                <Receipt size={24} />
                <Text variant="featured-3">
                  order history
                </Text>
                <Text variant="body-2" color="neutral-faded">
                  View your past purchases
                </Text>
                <Button
                  variant="outline"
                  size="small"
                  attributes={{
                    style: {
                      borderRadius: '15px',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }
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
                  textAlign: 'center',
                  cursor: 'pointer'
                }
              }}
              onClick={() => router.push('/shop')}
            >
              <View direction="column" align="center" gap={3}>
                <ShoppingBag size={24} />
                <Text variant="featured-3">
                  shop superfoods
                </Text>
                <Text variant="body-2" color="neutral-faded">
                  Discover premium products
                </Text>
                <Button
                  variant="solid"
                  size="small"
                  attributes={{
                    style: {
                      borderRadius: '15px',
                      fontSize: '10px',
                      fontWeight: '600',
                      letterSpacing: '0.5px'
                    }
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

function LoadingFallback() {
  return (
    <View 
      direction="column"
      align="center" 
      justify="center" 
      height="100vh"
      attributes={{ 
        style: { 
          backgroundColor: '#f5f3f0'
        } 
      }}
    >
      <Text>Loading dashboard...</Text>
    </View>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return <LoadingFallback />;
  }

  return <DashboardContent />;
}