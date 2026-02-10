'use client';

import { View } from 'reshaped';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View direction="column">
      {children}
    </View>
  );
}
