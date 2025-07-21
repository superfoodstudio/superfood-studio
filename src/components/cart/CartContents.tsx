'use client';

import { useState } from 'react';
import { View, Text, Button, Divider } from 'reshaped';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function CartContents() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, clearCart, isLoading, error } = useCart();
  const [operationLoading, setOperationLoading] = useState(false);
  
  console.log('CartContents rendering with cart:', cart);
  console.log('Cart items length:', cart?.items?.length);
  
  // Show error if there is one
  if (error) {
    return (
      <View direction="column" align="center" padding={8} gap={4}>
        <Text variant="title-2">Error</Text>
        <Text variant="body-1">{error}</Text>
        <Link href="/shop">
          <Button variant="solid">Continue Shopping</Button>
        </Link>
      </View>
    );
  }
  
  // Check if cart is empty
  if (!cart || cart.items.length === 0) {
    return (
      <View direction="column" align="center" padding={8} gap={4}>
        <Text variant="title-2">Your cart is empty</Text>
        <Text variant="body-1">Add some items to your cart and they will appear here.</Text>
        <Link href="/shop">
          <Button variant="solid">Continue Shopping</Button>
        </Link>
      </View>
    );
  }
    
  // Handle remove item
  const handleRemoveItem = (productId: string) => {
    setOperationLoading(true);
    removeFromCart(productId);
    setOperationLoading(false);
  };
  
  // Handle update quantity
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setOperationLoading(true);
    updateQuantity(productId, quantity);
    setOperationLoading(false);
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    setOperationLoading(true);
    clearCart();
    setOperationLoading(false);
  };
  
  // Proceed to checkout
  const handleCheckout = () => {
    router.push('/checkout');
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(price);
  };

  return (
    <View direction="column" gap={4} padding={4}>
      <Text variant="title-2">Your Cart</Text>
      
      <View direction="row" justify="end">
        <Button 
          variant="ghost" 
          onClick={handleClearCart}
          disabled={isLoading || operationLoading || cart.items.length === 0}
        >
          Clear Cart
        </Button>
      </View>
      
      <View direction="column" gap={2}>
        {cart.items.map((item) => (
          <View key={item.id} direction="row" gap={4} padding={3} backgroundColor="neutral-faded">
            <View width={80} height={80} position="relative">
              <img 
                src={item.product.photoUrl} 
                alt={item.product.name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </View>
            
            <View direction="column" gap={1} attributes={{ style: { flex: 1 } }}>
              <Text variant="title-3">{item.product.name}</Text>
              <Text variant="body-2">{formatPrice(item.price)}</Text>
              
              <View direction="row" gap={4} align="center">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button 
                    variant="ghost" 
                    size="small"
                    onClick={() => handleUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                    disabled={isLoading || operationLoading}
                  >
                    -
                  </Button>
                  <Text variant="body-1">{item.quantity}</Text>
                  <Button 
                    variant="ghost" 
                    size="small"
                    onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                    disabled={isLoading || operationLoading}
                  >
                    +
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => handleRemoveItem(item.productId)}
                  disabled={isLoading || operationLoading}
                >
                  Remove
                </Button>
              </View>
            </View>
            
            <View align="end">
              <Text variant="title-3">
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          </View>
        ))}
      </View>
      
      <Divider />
      
      <View direction="row" justify="space-between" padding={2}>
        <Text variant="title-3">Total</Text>
        <Text variant="title-2">{formatPrice(cart.total)}</Text>
      </View>
      
      <View direction="row" justify="end" gap={2}>
        <Link href="/shop">
          <Button variant="outline" disabled={isLoading || operationLoading}>Continue Shopping</Button>
        </Link>
        <Button variant="solid" onClick={handleCheckout} disabled={isLoading || operationLoading}>Checkout</Button>
      </View>
    </View>
  );
}