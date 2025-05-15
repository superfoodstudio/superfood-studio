'use client';

import { View, Text, Card } from 'reshaped';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import Link from 'next/link';

// Define the fragment directly in this file
export const ProductCardFragment = graphql`
  fragment ProductCardFragment on Product {
    id
    name
    slug
    description
    photoUrl
    price
    category
    tags
  }
`;

type Props = {
  product: any; // Will be properly typed after Relay generates types
};

export function ProductCard({ product }: Props) {
  const data = useFragment(ProductCardFragment, product);
  
  // Format price to show 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.price);

  return (
    <Link href={`/shop/products/${data.slug}`} style={{ textDecoration: 'none' }}>
      <Card>
        <View direction="column" gap={2}>
          <div style={{ position: 'relative', width: '100%', height: '200px' }}>
            <img 
              src={data.photoUrl} 
              alt={data.name}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', 
                borderRadius: '8px' 
              }}
            />
          </div>
          <View direction="column" gap={1} padding={2}>
            <Text variant="title-3">{data.name}</Text>
            <Text variant="title-4">{formattedPrice}</Text>
            <Text variant="body-2" color="neutral-faded">{data.category}</Text>
            <View direction="row" gap={1} wrap>
              {data.tags && data.tags.map((tag: string) => (
                <View 
                  key={tag}
                  backgroundColor="neutral-faded"
                  attributes={{
                    style: {
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }
                  }}
                >
                  <Text variant="caption-1">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Card>
    </Link>
  );
} 