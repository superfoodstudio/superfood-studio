'use client';

import { View, Text, Button } from 'reshaped';
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
    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          <Text variant="body-1" weight="medium" attributes={{ style: { fontSize: '1.1rem' } }}>
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
    </div>
  );
}
