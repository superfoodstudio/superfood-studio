'use client';

import { View, Text, Card, Button, Loader } from 'reshaped';
import { useFragment } from 'react-relay';
import { graphql } from 'relay-runtime';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartSimple } from 'phosphor-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { StarRating } from '@/components/ratings/StarRating';
import { QuantitySelector } from '@/components/ui/QuantitySelector';
import { ipfsUrl } from '@/lib/ipfs';

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
    averageRating
    totalRatings
  }
`;

type Props = {
  product: any; // Will be properly typed after Relay generates types
};

export function ProductCard({ product }: Props) {
  const data = useFragment(ProductCardFragment, product);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart, cart, updateQuantity, removeFromCart } = useCart();

  // Check if this product is in the cart and get its quantity
  const cartItem = cart?.items.find(item => item.productId === data.id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem?.quantity || 0;
  
  // Format price to show 2 decimal places
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(data.price);
  
  // Handle add to cart without navigating
  const handleAddToCart = (e: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => {
    e.preventDefault(); // Prevent navigation to product page
    e.stopPropagation();

    if (isAdding || data.inventory <= 0) {
      return;
    }

    setIsAdding(true);

    try {
      addToCart(data.id, 1, data.price, {
        name: data.name,
        photoUrl: data.photoUrl
      });
    } catch (error) {
      // Cart add failed silently
    } finally {
      setIsAdding(false);
    }
  };

  // Handle quantity increase
  const handleIncreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(data.id, cartQuantity + 1);
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem && cartQuantity > 1) {
      updateQuantity(data.id, cartQuantity - 1);
    }
  };

  // Handle remove from cart
  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(data.id);
  };

  return (
    <View height="360px" width="100%">
      <Link
        href={`/shop/products/${data.slug}`}
        style={{ textDecoration: "none", height: "100%", display: "block" }}
      >
        <Card padding={0} height="100%">
          <View direction="column" height="100%">
            {/* Image container */}
            <View
              position="relative"
              width="100%"
              height="200px"
              overflow="hidden"
            >
              <Image
                src={ipfsUrl(data.photoUrl)}
                alt={data.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
              />
              {data.inventory <= 0 && (
                <View
                  position="absolute"
                  inset={0}
                  backgroundColor="neutral-faded"
                  direction="column"
                  align="center"
                  justify="center"
                  attributes={{
                    style: {
                      backgroundColor: 'rgba(0, 0, 0, 0.6)'
                    }
                  }}
                >
                  <Text variant="title-3"
                        attributes={{ style: { color: 'white', fontWeight: 'bold' } }}>
                    Sold Out
                  </Text>
                </View>
              )}
            </View>

            {/* Content section - fills remaining space */}
            <View
              direction="column"
              padding={4}
              gap={1}
              height="160px"
              position="relative"
            >
              <View direction="column" gap={1}>
                {/* Product title */}
                <Text variant="featured-3" weight="medium" maxLines={1}>
                  {data.name}
                </Text>

                {/* Price */}
                <Text variant="body-2">
                  {formattedPrice}
                </Text>

                {/* Rating Display */}
                <StarRating
                  itemId={data.id}
                  itemType="product"
                  averageRating={data.averageRating || 0}
                  totalRatings={data.totalRatings || 0}
                  size="small"
                  readonly={true}
                />
              </View>

              {/* Absolutely positioned category */}
              <View position="absolute" insetBottom={4} insetStart={4}>
                <Text variant="caption-1" color="neutral-faded" weight="medium">
                  {data.category.toUpperCase()}
                </Text>
              </View>

              {/* Absolutely positioned cart button or quantity selector */}
              <View position="absolute" insetBottom={4} insetEnd={4}>
                {isInCart ? (
                  <View
                    padding={2}
                    borderRadius="medium"
                    attributes={{
                      style: {
                        border: '1px solid var(--rs-color-border-neutral-faded)',
                      },
                      onClick: (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                    }}
                  >
                    <QuantitySelector
                      quantity={cartQuantity}
                      onIncrease={() => updateQuantity(data.id, cartQuantity + 1)}
                      onDecrease={() => {
                        if (cartQuantity === 1) {
                          removeFromCart(data.id);
                        } else {
                          updateQuantity(data.id, cartQuantity - 1);
                        }
                      }}
                      disabled={isAdding}
                      size="small"
                    />
                  </View>
                ) : (
                  <Button
                    variant="ghost"
                    size="large"
                    disabled={isAdding || data.inventory <= 0}
                    onClick={handleAddToCart}
                    rounded
                  >
                    {isAdding ? (
                      <Loader size="small" />
                    ) : (
                      <ShoppingCartSimple size={18} />
                    )}
                  </Button>
                )}
              </View>
            </View>
          </View>
        </Card>
      </Link>
    </View>
  );
} 