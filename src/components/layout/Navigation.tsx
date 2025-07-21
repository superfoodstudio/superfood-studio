'use client';

import { View, Text, Button, Badge } from 'reshaped';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { ShoppingCart, User, List } from 'phosphor-react';
import { usePathname } from 'next/navigation';
import { MobileMenu } from './MobileMenu';

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  
  // Use the same localStorage hook as the cart - this will auto-sync!
  const [localCart] = useLocalStorage<LocalCartItem[]>('superfood_cart', []);
  
  // Calculate cart count directly from localStorage data
  const cartItemCount = localCart.reduce((sum, item) => sum + item.quantity, 0);
  
  console.log('Navigation cart data:', localCart, 'count:', cartItemCount);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        justify="space-between"
        align="center"
        padding={4}
        backgroundColor="elevation-base"
        width="100%"
        attributes={{
          style: {
            position: 'sticky',
            top: 0,
            zIndex: 100,
          }
        }}
      >
        <View>
          {/* Menu Button */}
          <Button
            variant="ghost"
            size="small"
            onClick={() => setMenuOpen(true)}
            attributes={{
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }
            }}
          >
            <List size={24} />
            <Text variant="body-2">MENU</Text>
          </Button>
        </View>

        {/* Logo - Centered */}
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
            <Text
              variant="featured-2"
              attributes={{
                style: {
                  fontFamily: 'var(--font-big-caslon)',
                  color: 'black',
                  textAlign: 'center'
                }
              }}
            >
              Superfood Studio
            </Text>
          </Link>
        </View>

        <View direction="row" align="center" gap={3}>
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
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: '#2E1A47',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  <User size={18} weight="fill" color="white" />
                </div>
              </Button>

              {dropdownOpen && (
                <View
                  backgroundColor="elevation-raised"
                  borderRadius="medium"
                  padding={1}
                  attributes={{
                    style: {
                      position: 'absolute',
                      right: 0,
                      top: '40px',
                      width: '200px',
                      border: '1px solid var(--rs-color-border-neutral)',
                      boxShadow: 'var(--rs-shadow-overlay)',
                      zIndex: 100,
                    }
                  }}
                >
                  <View direction="column" width="100%">
                    {/* Dashboard Section */}
                    <Link
                      href="/dashboard"
                      style={{
                        textDecoration: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Text weight="medium">Dashboard</Text>
                    </Link>
                    <Link
                      href="/dashboard/membership"
                      style={{
                        textDecoration: 'none',
                        padding: '6px 16px 6px 32px',
                        borderRadius: '4px',
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Text variant="body-2" color="neutral-faded">Membership</Text>
                    </Link>
                    <Link
                      href="/dashboard/orders"
                      style={{
                        textDecoration: 'none',
                        padding: '6px 16px 6px 32px',
                        borderRadius: '4px',
                      }}
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Text variant="body-2" color="neutral-faded">Order History</Text>
                    </Link>

                    {userRole === 'ADMIN' && (
                      <>
                        <View
                          height="1px"
                          backgroundColor="neutral-faded"
                          attributes={{
                            style: {
                              margin: '8px 16px'
                            }
                          }}
                        />
                        <Link
                          href="/admin"
                          style={{
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                          }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Text weight="medium">Admin</Text>
                        </Link>
                        <Link
                          href="/admin/products"
                          style={{
                            textDecoration: 'none',
                            padding: '6px 16px 6px 32px',
                            borderRadius: '4px',
                          }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Text variant="body-2" color="neutral-faded">Manage Products</Text>
                        </Link>
                        <Link
                          href="/admin/recipes"
                          style={{
                            textDecoration: 'none',
                            padding: '6px 16px 6px 32px',
                            borderRadius: '4px',
                          }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Text variant="body-2" color="neutral-faded">Manage Recipes</Text>
                        </Link>
                        <Link
                          href="/admin/orders"
                          style={{
                            textDecoration: 'none',
                            padding: '6px 16px 6px 32px',
                            borderRadius: '4px',
                          }}
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Text variant="body-2" color="neutral-faded">Manage Orders</Text>
                        </Link>
                      </>
                    )}

                    <View
                      height="1px"
                      backgroundColor="neutral-faded"
                      attributes={{
                        style: {
                          margin: '4px 0'
                        }
                      }}
                    />

                    <Button
                      variant="ghost"
                      attributes={{
                        style: {
                          justifyContent: 'flex-start',
                          padding: '8px 16px',
                          width: '100%',
                          textAlign: 'left'
                        }
                      }}
                      onClick={() => {
                        logout();
                        setDropdownOpen(false);
                      }}
                    >
                      Sign Out
                    </Button>
                  </View>
                </View>
              )}
            </div>
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

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={authenticated}
        userRole={userRole}
        onLogin={login}
        onLogout={logout}
      />
    </>
  );
}
