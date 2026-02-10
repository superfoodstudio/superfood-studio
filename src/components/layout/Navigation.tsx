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

  // Fetch user role
  useEffect(() => {
    if (authenticated) {
      const fetchUserRole = async () => {
        try {
          const token = await getAccessToken();
          if (!token) {
            setUserRole('PUBLIC');
            return;
          }

          const response = await fetch('/api/user/role', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (error) {
          // Failed to fetch user role
        }
      };

      fetchUserRole();
    } else {
      setUserRole(null);
    }
  }, [authenticated, getAccessToken]);

  useEffect(() => {
    if (!ready || !authenticated || !user) return;

    // Get the access token
    getAccessToken().then(token => {
      if (!token) return;

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
      .catch(() => {});
    });
  }, [ready, authenticated, user, getAccessToken]);

  return (
    <>
      <View
        as="header"
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
        <View
          direction="row"
          align="center"
          padding={{ s: 4, m: 6 }}
          width="100%"
          attributes={{
            style: {
              maxWidth: '1280px',
              margin: '0 auto'
            }
          }}
        >
        {/* Logo - Centered on desktop, left on mobile */}
        <View
          attributes={{
            className: 'nav-logo-container',
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
                className: 'nav-logo-inner',
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
                  className: 'nav-logo-superfood',
                  style: {
                    fontFamily: 'var(--font-midruns-script)',
                    color: 'var(--rs-color-forest-green)',
                    fontSize: '2.6rem',
                    position: 'absolute',
                    top: '-6px',
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
                  className: 'nav-logo-studio',
                  style: {
                    fontFamily: 'var(--font-midruns-sans)',
                    color: 'var(--rs-color-forest-green)',
                    fontSize: '1.8rem',
                    position: 'absolute',
                    bottom: '0px',
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
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Button variant="ghost" size="small">
                <ShoppingCart size={24} />
              </Button>
              {cartItemCount > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    backgroundColor: '#ef4444',
                    pointerEvents: 'none',
                    zIndex: 1000
                  }}
                />
              )}
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
                <Link href="/dashboard/profile" style={{ textDecoration: 'none', color: 'black' }}>
                  <DropdownMenu.Item>Profile</DropdownMenu.Item>
                </Link>
                <Link href="/dashboard/membership" style={{ textDecoration: 'none', color: 'black' }}>
                  <DropdownMenu.Item>Membership</DropdownMenu.Item>
                </Link>
                <Link href="/dashboard/orders" style={{ textDecoration: 'none', color: 'black' }}>
                  <DropdownMenu.Item>Order History</DropdownMenu.Item>
                </Link>
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
      </View>

    </>
  );
}
