import { AppContainer } from '@/components/layout/AppContainer';
import dynamicImport from 'next/dynamic';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Use dynamic import with SSR disabled for the client component that uses Relay
const ProductsContent = dynamicImport(
  () => import('./ProductsContent'),
  { ssr: false }
);

export default function ShopPage() {
  return (
    <AppContainer>
      <ProductsContent />
    </AppContainer>
  );
} 