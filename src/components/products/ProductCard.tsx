'use client';

import { View, Text, Card, Button } from 'reshaped';
import { useFragment, useMutation } from 'react-relay';
import { graphql } from 'relay-runtime';
import Link from 'next/link';
import { ShoppingCartSimple } from 'phosphor-react';
import { useState } from 'react';
import { AddToCartMutation } from '@/graphql/queries/CartQueries';

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
    inventory
  }
`;

type Props = {
  product: any; // Will be properly typed after Relay generates types
};

export function ProductCard({ product }: Props) {
  const data = useFragment(ProductCardFragment, product);
  const [isAdding, setIsAdding] = useState(false);
  
  // Add to cart mutation
  const [addToCart] = useMutation(AddToCartMutation);
  
  // Format price to show 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.price);
  
  // Handle add to cart without navigating
  const handleAddToCart = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();
    
    if (isAdding || data.inventory <= 0) return;
    
    setIsAdding(true);
    
    // Add item to cart using mutation
    addToCart({
      variables: {
        input: {
          productId: data.id,
          quantity: 1
        }
      },
      onCompleted: () => {
        setIsAdding(false);
        // Optionally update local cart count in localStorage
        const currentCount = localStorage.getItem('cartItemCount');
        if (currentCount) {
          localStorage.setItem('cartItemCount', (parseInt(currentCount, 10) + 1).toString());
        } else {
          localStorage.setItem('cartItemCount', '1');
        }
        
        // Dispatch event to notify Navigation component about cart updates
        window.dispatchEvent(new Event('cartUpdated'));
      },
      onError: (error) => {
        console.error('Error adding to cart:', error);
        setIsAdding(false);
      }
    });
  };

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
            {data.inventory <= 0 && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}>
                <Text variant="title-3" attributes={{ style: { color: 'white' } }}>Sold Out</Text>
              </div>
            )}
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
            
            <div onClick={handleAddToCart}>
              <Button 
                variant="solid" 
                size="small"
                fullWidth
                disabled={isAdding || data.inventory <= 0}
                attributes={{
                  style: {
                    marginTop: '8px'
                  }
                }}
              >
                <View direction="row" gap={1} align="center">
                  <ShoppingCartSimple size={16} />
                  <Text>{isAdding ? 'Adding...' : 'Add to Cart'}</Text>
                </View>
              </Button>
            </div>
          </View>
        </View>
      </Card>
    </Link>
  );
} 