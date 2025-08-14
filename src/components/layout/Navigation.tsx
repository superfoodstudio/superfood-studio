'use client';

import { View, Text, Button, Badge, DropdownMenu } from 'reshaped';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ShoppingCart, User } from 'phosphor-react';
import { usePathname } from 'next/navigation';

interface LocalCartItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  productPhoto?: string;
}

export function Navigation() {
  const { login, logout, authenticated, ready, user, getAccessToken } = usePrivy();
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  // Use the same localStorage hook as the cart - this will auto-sync!
  const [localCart] = useLocalStorage<LocalCartItem[]>('superfood_cart', []);

  // Calculate cart count directly from localStorage data
  const cartItemCount = localCart.reduce((sum, item) => sum + item.quantity, 0);

  console.log('Navigation cart data:', localCart, 'count:', cartItemCount);

  // Fetch user role
  useEffect(() => {
    if (authenticated) {
      const fetchUserRole = async () => {
        try {
          const response = await fetch('/api/user/role');
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      };

      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [authenticated]);

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    // Get the access token
    getAccessToken().then(token => {
      if (!token) {
        console.error('No access token received');
        return;
      }

      // Call our auth callback endpoint
      fetch('/api/auth/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          token,
        }),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Auth callback failed');
        }
        return response.json();
      })
      .catch(error => console.error('Auth callback error:', error));
    });
  }, [ready, authenticated, user, getAccessToken]);

  return (
    <>
      <View
        as="header"
        direction="row"
        align="center"
        padding={6}
        backgroundColor="page"
        width="100%"
        attributes={{
          style: {
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }
        }}
      >
        {/* Logo - Centered with absolute positioning */}
        <View
          attributes={{
            style: {
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <View
              attributes={{
                style: {
                  position: 'relative',
                  width: '160px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              }}
            >
              {/* Superfood - Top left, larger */}
              <Text
                variant="featured-1"
                attributes={{
                  style: {
                    fontFamily: 'var(--font-midruns-script)',
                    color: 'var(--rs-color-forest-green)',
                    fontSize: '2.6rem',
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    lineHeight: '1.2'
                  }
                }}
              >
                Superfood
              </Text>
              {/* Studio - Bottom right, with proper spacing */}
              <Text
                variant="featured-1"
                attributes={{
                  style: {
                    fontFamily: 'var(--font-midruns-sans)',
                    color: 'var(--rs-color-forest-green)',
                    fontSize: '1.8rem',
                    position: 'absolute',
                    bottom: '-8px',
                    right: '-4px',
                    lineHeight: '1.2'
                  }
                }}
              >
                Studio
              </Text>
            </View>
          </Link>
        </View>

        {/* Right side controls - positioned to the right */}
        <View direction="row" align="center" gap={3} attributes={{ style: { marginLeft: 'auto' } }}>
          {/* Cart Icon with Counter */}
          <Link href="/cart">
            <div style={{ position: 'relative' }}>
              <Button variant="ghost" size="small">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <Badge
                    variant="outline"
                    color="critical"
                    attributes={{
                      style: {
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        borderRadius: '50%',
                        minWidth: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }
                    }}
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </Link>

          {authenticated ? (
            <DropdownMenu
              position="bottom-end"
              fallbackPositions={["bottom-start", "top-end", "top-start"]}
            >
              <DropdownMenu.Trigger>
                {(attributes) => (
                  <Button
                    variant="ghost"
                    size="small"
                    attributes={attributes}
                  >
                    <User size={24} weight="regular" />
                  </Button>
                )}
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {userRole === 'ADMIN' && (
                  <Link href="/admin" style={{ textDecoration: 'none', color: 'black' }}>
                    <DropdownMenu.Item>Admin</DropdownMenu.Item>
                  </Link>
                )}
                <Link href="/dashboard" style={{ textDecoration: 'none', color: 'black' }}>
                  <DropdownMenu.Item>Dashboard</DropdownMenu.Item>
                </Link>
                <Link href="/dashboard/membership" style={{ textDecoration: 'none', color: 'black' }}>
                  <DropdownMenu.Item>Membership</DropdownMenu.Item>
                </Link>
                <Link href="/dashboard/orders" style={{ textDecoration: 'none', color: 'black' }}>
                  <DropdownMenu.Item>Order History</DropdownMenu.Item>
                </Link>
                {userRole === 'ADMIN' && (
                  <>
                    <Link href="/admin/products" style={{ textDecoration: 'none', color: 'black' }}>
                      <DropdownMenu.Item>Manage Products</DropdownMenu.Item>
                    </Link>
                    <Link href="/admin/recipes" style={{ textDecoration: 'none', color: 'black' }}>
                      <DropdownMenu.Item>Manage Recipes</DropdownMenu.Item>
                    </Link>
                    <Link href="/admin/orders" style={{ textDecoration: 'none', color: 'black' }}>
                      <DropdownMenu.Item>Manage Orders</DropdownMenu.Item>
                    </Link>
                  </>
                )}
                <DropdownMenu.Item onClick={() => logout()} attributes={{ style: { color: 'black' } }}>
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="small"
              onClick={() => login()}
            >
              Sign In
            </Button>
          )}
        </View>
      </View>

    </>
  );
}
