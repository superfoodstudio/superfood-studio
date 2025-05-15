import { View, Text } from 'reshaped';
import { AppContainer } from '@/components/layout/AppContainer';
import dynamic from 'next/dynamic';

// Force dynamic rendering
export const dynamicParams = 'force-dynamic';

// Use dynamic import with SSR disabled for the client component that uses Relay
const ProductsContent = dynamic(
  () => import('./ProductsContent'),
  { ssr: false }
);

export default function ShopPage() {
  return (
    <AppContainer>
      <View direction="column" gap={4}>
        <View direction="column" align="center" padding={4}>
          <Text variant="title-1" align="center">Our Products</Text>
          <Text variant="body-1" align="center">
            Discover our superfoods and health products
          </Text>
        </View>
        
        {/* Load the Relay content dynamically client-side only */}
        <ProductsContent />
      </View>
    </AppContainer>
  );
} 