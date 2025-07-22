'use client';

import { View, Text, Button } from 'reshaped';
import Link from 'next/link';
import React from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View direction="column" height="100vh">
      {/* Header */}
      <View
        as="header"
        direction="row"
        justify="space-between"
        align="center"
        padding={4}
        backgroundColor="page"
      >
        <Text variant="title-2">Admin Recipes</Text>
        <Link href="/profile">
          <Button variant="ghost">Profile</Button>
        </Link>
      </View>


      {/* Main Content */}
      <View grow padding={4}>
        {children}
      </View>
    </View>
  );
}
