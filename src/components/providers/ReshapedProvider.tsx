'use client';

import { Reshaped } from 'reshaped';
import '@/themes/superfood/theme.css';

export function ReshapedProvider({ children }: { children: React.ReactNode }) {
  return <Reshaped theme="superfood">{children}</Reshaped>;
} 