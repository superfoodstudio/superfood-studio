'use client';

import { View, Text } from 'reshaped';
import { AppContainer } from '@/components/layout/AppContainer';
import { RecipesContentSimple } from './RecipesContentSimple';

export default function RecipesPage() {
  return (
    <AppContainer>
      <View direction="column" gap={4}>
        <View direction="column" align="center" padding={4}>
          <Text variant="title-1" align="center">Our Recipes</Text>
          <Text variant="body-1" align="center">
            Discover our collection of superfood recipes
          </Text>
        </View>
        
        <RecipesContentSimple />
      </View>
    </AppContainer>
  );
} 