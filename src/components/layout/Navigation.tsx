'use client';

import { View, Text, Button, Badge } from 'reshaped';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useRef } from 'react';
import { ShoppingCart, User, List } from 'phosphor-react';

export function Navigation() {
  const { login, logout, authenticated, ready, user, getAccessToken } = usePrivy();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  // Fetch cart count on client side
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart/count');
        if (response.ok) {
          const data = await response.json();
          setCartItemCount(data.count || 0);
        }
      } catch (error) {
        console.error('Error fetching cart count:', error);
      }
    };

    // Fetch the cart count instead of generating random numbers
    fetchCartCount();
    
    // Set up event listener for cart updates
    const handleCartUpdate = () => {
      fetchCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

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
      async function fetchUserRole() {
        try {
          const response = await fetch('/api/user/role');
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }

      fetchUserRole();
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
      .then(data => console.log('Auth callback response:', data))
      .catch(error => console.error('Auth callback error:', error));
    });
  }, [ready, authenticated, user, getAccessToken]);

  return (
    <>
      <View as="header" direction="row" justify="space-between" align="center" padding={4} backgroundColor="elevation-base">
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
              variant="title-3"
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
          
          {ready && authenticated ? (
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
                <div style={{
                  position: 'absolute',
                  top: '40px',
                  right: 0,
                  width: '200px',
                  backgroundColor: 'white',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  zIndex: 100,
                }}>
                  <Link href="/profile" style={{ width: '100%', textDecoration: 'none' }}>
                    <div style={{ padding: '8px 16px', cursor: 'pointer', color: '#333' }}>
                      Profile
                    </div>
                  </Link>

                  {userRole === 'ADMIN' && (
                    <>
                      <Link href="/admin" style={{ width: '100%', textDecoration: 'none' }}>
                        <div style={{ padding: '8px 16px', cursor: 'pointer', color: '#333' }}>
                          Admin Dashboard
                        </div>
                      </Link>
                      <Link href="/admin/recipes" style={{ width: '100%', textDecoration: 'none' }}>
                        <div style={{ padding: '8px 16px', cursor: 'pointer', color: '#333' }}>
                          Admin Recipes
                        </div>
                      </Link>
                      <Link href="/admin/products" style={{ width: '100%', textDecoration: 'none' }}>
                        <div style={{ padding: '8px 16px', cursor: 'pointer', color: '#333' }}>
                          Admin Products
                        </div>
                      </Link>
                    </>
                  )}

                  <div 
                    style={{ padding: '8px 16px', cursor: 'pointer', color: '#333', borderTop: '1px solid #eee' }}
                    onClick={() => logout()}
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button variant="ghost" size="small" onClick={() => login()}>
              <Text variant="body-2">SIGN IN</Text>
            </Button>
          )}
        </View>
      </View>

      {/* Menu Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: menuOpen ? 0 : '-100%',
          width: '300px',
          height: '100vh',
          backgroundColor: '#FDF6E3',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          boxShadow: menuOpen ? '0 0 15px rgba(0,0,0,0.2)' : 'none',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        <View 
          direction="row" 
          justify="space-between" 
          align="center"
        >
          <Text
            variant="title-3"
            attributes={{
              style: {
                fontFamily: 'var(--font-big-caslon)'
              }
            }}
          >
            Superfood Studio
          </Text>
          <Button 
            variant="ghost" 
            size="small" 
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </Button>
        </View>
        
        <View height="1px" backgroundColor="neutral-faded" />
        
        <View direction="column" gap={4}>
          <Link href="/" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Text variant="body-1" color="neutral">ABOUT US</Text>
          </Link>
          
          <Link href="/subscription" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Text variant="body-1" color="neutral">BECOME A MEMBER</Text>
          </Link>
          
          <Link href="/faqs" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Text variant="body-1" color="neutral">FAQ</Text>
          </Link>
          
          <Link href="/contact" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none' }}>
            <Text variant="body-1" color="neutral">CONTACT US</Text>
          </Link>
        </View>
        
        <View 
          attributes={{
            style: {
              marginTop: 'auto'
            }
          }}
        >
          <View 
            direction="row" 
            justify="center" 
            gap={4}
            attributes={{
              style: {
                marginBottom: '8px'
              }
            }}
          >
            <Link href="https://instagram.com/superfoodstudio" target="_blank" style={{ textDecoration: 'none' }}>
              <div style={{
                width: '36px', 
                height: '36px', 
                borderRadius: '50%',
                backgroundColor: '#2E1A47',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text color="neutral">IG</Text>
              </div>
            </Link>
          </View>
          <Text variant="body-2" align="center" color="neutral">@SUPERFOODSTUDIO</Text>
        </View>
      </div>
      
      {/* Overlay for menu */}
      {menuOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
} 