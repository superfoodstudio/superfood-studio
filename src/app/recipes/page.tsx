import { View, Text } from 'reshaped';
import { AppContainer } from '@/components/layout/AppContainer';
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamicParams = 'force-dynamic';

// Use dynamic import with SSR disabled for the client component that uses Relay
const RecipesContent = dynamic(
  () => import('./RecipesContent'),
  { ssr: false }
);

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
        
        {/* Load the Relay content dynamically client-side only */}
        <RecipesContent />
      </View>
    </AppContainer>
  );
} 