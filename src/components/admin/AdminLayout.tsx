'use client';

import { View, Text, Button } from 'reshaped';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  backUrl?: string;
  actions?: ReactNode;
}

export function AdminLayout({ children, title, backUrl = '/admin', actions }: AdminLayoutProps) {
  const router = useRouter();

  return (
    <View width="100%" minHeight="100vh">
      <View
        direction="column"
        gap={6}
        padding={8}
        width="100%"
        maxWidth="1200px"
        attributes={{
          style: {
            margin: '0 auto'
          }
        }}
      >
        <View direction="row" justify="space-between" align="center">
          <View direction="row" align="center" gap={2}>
            {backUrl && (
              <Button
                variant="ghost"
                size="small"
                onClick={() => router.push(backUrl)}
              >
                ← Back
              </Button>
            )}
            <Text 
              variant="body-1" 
              weight="medium"
              attributes={{
                style: {
                  fontFamily: 'var(--font-midruns-sans)',
                  fontSize: '1.25rem'
                }
              }}
            >
              {title}
            </Text>
          </View>

          {actions && (
            <View direction="row" gap={2}>
              {actions}
            </View>
          )}
        </View>

        {children}
      </View>
    </View>
  );
}
