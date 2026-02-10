'use client';

import { useCallback, useMemo, useState } from 'react';
import { useLocalStorage, useEventListener } from 'usehooks-ts';
import { usePrivy } from '@privy-io/react-auth';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    photoUrl: string;
    price: number;
    inventory: number;
  };
}

export interface Cart {
  id?: string;
  items: CartItem[];
  total: number;
}

// Local storage cart item (simpler structure)
interface LocalCartItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  productPhoto?: string;
}

const CART_STORAGE_KEY = 'superfood_cart';

export function useCart() {
  const { authenticated, ready } = usePrivy();
  const [localCart, setLocalCart] = useLocalStorage<LocalCartItem[]>(CART_STORAGE_KEY, []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add item to cart
  const addToCart = useCallback((productId: string, quantity: number, price: number, product: any) => {
    setIsLoading(true);
    setError(null);

    try {
      setLocalCart(prev => {
        const existing = prev.find(item => item.productId === productId);
        let newCart;
        
        if (existing) {
          newCart = prev.map(item =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  productName: product?.name || item.productName,
                  productPhoto: product?.photoUrl || item.productPhoto
                }
              : item
          );
        } else {
          newCart = [...prev, {
            productId,
            quantity,
            price,
            productName: product?.name || 'Product',
            productPhoto: product?.photoUrl || '/placeholder.jpg'
          }];
        }

        return newCart;
      });
    } catch (e) {
      setError('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  }, [setLocalCart]);

  // Remove item from cart
  const removeFromCart = useCallback((productId: string) => {
    setLocalCart(prev => prev.filter(item => item.productId !== productId));
  }, [setLocalCart]);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setLocalCart(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [setLocalCart, removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setLocalCart([]);
  }, [setLocalCart]);

  // Get current cart
  const cart = useMemo((): Cart => {
    const total = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items: localCart.map(item => ({
        id: item.productId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.productId,
          name: item.productName || 'Product',
          photoUrl: item.productPhoto || '/placeholder.jpg',
          price: item.price,
          inventory: 999
        }
      })),
      total
    };
  }, [localCart]);

  // Get cart item count
  const itemCount = useMemo(() => {
    return localCart.reduce((sum, item) => sum + item.quantity, 0);
  }, [localCart]);

  return {
    cart,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoading,
    error,
    isAuthenticated: authenticated && ready
  };
}