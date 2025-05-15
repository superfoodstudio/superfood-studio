'use client';

import { View, Text, Button, Badge } from 'reshaped';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState, useRef } from 'react';
import { ShoppingCart, House, CookingPot, ShoppingBag, User } from 'phosphor-react';

export function Navigation() {
  const { login, logout, authenticated, ready, user, getAccessToken } = usePrivy();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

    // For demo purposes, set a random count between 0 and 5
    setCartItemCount(Math.floor(Math.random() * 6));
    
    // In a real app, we would use:
    // fetchCartCount();
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
    <View as="header" direction="row" justify="space-between" align="center" padding={4} backgroundColor="elevation-base">
      <View direction="row" align="center" gap={6}>
        <Link href="/">
          <Text variant="title-3">Superfood Studio</Text>
        </Link>

        <View as="nav" direction="row" gap={4}>
          <Link href="/">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <House size={18} />
              <Text>Home</Text>
            </div>
          </Link>
          <Link href="/shop">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShoppingBag size={18} />
              <Text>Shop</Text>
            </div>
          </Link>
          <Link href="/recipes">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CookingPot size={18} />
              <Text>Recipes</Text>
            </div>
          </Link>
        </View>
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
          <Button variant="solid" size="small" onClick={() => login()}>
            Login
          </Button>
        )}
      </View>
    </View>
  );
} 