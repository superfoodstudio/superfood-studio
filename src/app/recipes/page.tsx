'use client';

export const dynamic = 'force-dynamic';

import { View, Text } from 'reshaped';
import { AppContainer } from '@/components/layout/AppContainer';
import { FeaturedRecipe } from '@/components/recipes/FeaturedRecipe';
import { AllRecipesSection } from './AllRecipesSection';

export default function RecipesPage() {
  return (
    <AppContainer>
      <View direction="column" gap={6} paddingTop={4}>
        {/* Featured Recipe - Latest Recipe */}
        <View
          attributes={{
            style: { paddingLeft: '1rem', paddingRight: '1rem' }
          }}
        >
          <FeaturedRecipe />
        </View>
        
        {/* All Recipes Section */}
        <AllRecipesSection />
      </View>
    </AppContainer>
  );
} 