'use client';

import { View, Text, Button, Modal } from 'reshaped';
import Link from 'next/link';
import { X } from 'phosphor-react';
import { usePathname } from 'next/navigation';

// Define our navigation items
const mainNavItems = [
  { label: 'Home', path: '/' },
  { label: 'Recipes', path: '/recipes' },
  { label: 'Shop', path: '/shop' },
  { label: 'Subscription', path: '/subscription' }
];

const dashboardNavItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Membership', path: '/dashboard/membership' },
  { label: 'Orders', path: '/dashboard/orders' }
];

const adminNavItems = [
  { label: 'Admin Dashboard', path: '/admin' },
  { label: 'Products', path: '/admin/products' },
  { label: 'Recipes', path: '/admin/recipes' },
  { label: 'Orders', path: '/admin/orders' }
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  userRole: string | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  isAuthenticated,
  userRole,
  onLogin,
  onLogout
}: MobileMenuProps) {
  const pathname = usePathname();

  return (
    <Modal
      active={isOpen}
      onClose={onClose}
      position={'start'}
      size={'40vw'}
    >
      <View
        direction="column"
        gap={6}
        padding={4}
        height="100%"
        backgroundColor="elevation-base"
      >
        <View direction="row" justify="space-between" align="center">
          <Text variant="title-3" attributes={{
            style: {
              fontFamily: 'var(--font-big-caslon)',
            }
          }}>
            Menu
          </Text>
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
          >
            <X size={24} />
          </Button>
        </View>

        <View direction="column" gap={4}>
          <Text variant="featured-2">Navigation</Text>

          {mainNavItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={onClose}
              style={{
                textDecoration: 'none',
                padding: '8px 0',
                display: 'block'
              }}
            >
              <Text
                variant="featured-3"
                color={pathname === item.path ? 'primary' : 'neutral'}
              >
                {item.label}
              </Text>
            </Link>
          ))}

          {isAuthenticated && (
            <>
              <View paddingTop={4}>
                <Text variant="featured-2">Dashboard</Text>
              </View>

              {dashboardNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  style={{
                    textDecoration: 'none',
                    padding: '8px 0',
                    display: 'block'
                  }}
                >
                  <Text
                    variant="featured-3"
                    color={pathname.startsWith(item.path) ? 'primary' : 'neutral'}
                  >
                    {item.label}
                  </Text>
                </Link>
              ))}
            </>
          )}

          {isAuthenticated && userRole === 'ADMIN' && (
            <>
              <View paddingTop={4}>
                <Text variant="featured-2">Admin</Text>
              </View>

              {adminNavItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  style={{
                    textDecoration: 'none',
                    padding: '8px 0',
                    display: 'block'
                  }}
                >
                  <Text
                    variant="featured-3"
                    color={pathname.startsWith(item.path) ? 'primary' : 'neutral'}
                  >
                    {item.label}
                  </Text>
                </Link>
              ))}
            </>
          )}
        </View>

        <View attributes={{
          style: {
            marginTop: 'auto'
          }
        }}>
          {isAuthenticated ? (
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Button
              variant="solid"
              fullWidth
              onClick={() => {
                onLogin();
                onClose();
              }}
            >
              Sign In
            </Button>
          )}
        </View>
      </View>
    </Modal>
  );
}
