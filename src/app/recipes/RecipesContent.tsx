'use client';

import { Suspense, useEffect, useState } from 'react';
import { View, Grid, Text } from 'reshaped';
import { SkeletonCard } from '@/components/ui/SkeletonCard';

// Force error if this file is loaded on the server
if (typeof window === 'undefined') {
  throw new Error('RecipesContent should only be loaded on the client');
}

// Create placeholder components that will be rendered initially
// These will be replaced with actual data-loaded components once the client code runs
function RecipeList() {
  return <RecipeListSkeleton />;
}

function RecipeListSkeleton() {
  return (
    <Grid columns={{ s: 1, m: 2, l: 3, xl: 3 }} gap={4}>
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
}

// The main component that will be rendered on the client
export default function RecipesContent() {
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [Component, setComponent] = useState<React.ComponentType>(() => RecipeListSkeleton);

  // Only load Relay on the client after mounting
  useEffect(() => {
    // This code runs only on the client side
    const loadClientComponents = async () => {
      try {
        // Load the real Recipes component that uses Relay
        const RealRecipesComponent = await import('./RealRecipesComponent').then(mod => mod.default);
        setComponent(() => RealRecipesComponent);
      } catch (error) {
        // If loading fails, show an error message
        setComponent(() => () => (
          <Text variant="body-1" color="critical">Failed to load recipes. Please try again later.</Text>
        ));
      } finally {
        setIsClientLoaded(true);
      }
    };

    loadClientComponents();
  }, []);

  return (
    <View padding={4}>
      <Suspense fallback={<RecipeListSkeleton />}>
        <Component />
      </Suspense>
    </View>
  );
} 