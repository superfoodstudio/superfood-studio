'use client';

import { Reshaped } from 'reshaped';
import '@/themes/superfood/theme.css';
import '@/themes/superfood/media.css';

export function ReshapedProvider({ children }: { children: React.ReactNode }) {
  return (
    <Reshaped theme="superfood">{children}</Reshaped>
  );
} 