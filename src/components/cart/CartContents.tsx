'use client';

import { View, Text, Button, Divider } from 'reshaped';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { 
  CartQuery, 
  RemoveFromCartMutation, 
  UpdateCartItemMutation,
  ClearCartMutation
} from '@/graphql/queries/CartQueries';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define a basic cart item type to avoid 'any' type errors
type CartItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    photoUrl: string;
  }
};

export function CartContents() {
  const router = useRouter();
  
  // Fetch cart data with type assertion to avoid unknown type issues
  const data = useLazyLoadQuery(CartQuery, {}) as any;
  
  // Setup mutations
  const [removeFromCart] = useMutation(RemoveFromCartMutation);
  const [updateCartItem] = useMutation(UpdateCartItemMutation);
  const [clearCart] = useMutation(ClearCartMutation);
  
  // Check if cart is empty
  if (!data.cart || data.cart.items.length === 0) {
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
  const handleRemoveItem = (cartItemId: string) => {
    removeFromCart({
      variables: { cartItemId },
      optimisticResponse: {
        removeFromCart: {
          id: data.cart.id,
          total: data.cart.total,
          items: data.cart.items.filter((item: CartItem) => item.id !== cartItemId)
        }
      }
    });
  };
  
  // Handle update quantity
  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    updateCartItem({
      variables: { cartItemId, quantity },
      optimisticResponse: {
        updateCartItem: {
          id: data.cart.id,
          total: data.cart.total,
          items: data.cart.items.map((item: CartItem) => 
            item.id === cartItemId 
              ? { ...item, quantity } 
              : item
          )
        }
      }
    });
  };
  
  // Handle clear cart
  const handleClearCart = () => {
    clearCart({
      variables: {},
      onCompleted: () => {
        // You could show a toast/notification here
      }
    });
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
          disabled={!data.cart || data.cart.items.length === 0}
        >
          Clear Cart
        </Button>
      </View>
      
      <View direction="column" gap={2}>
        {data.cart.items.map((item: CartItem) => (
          <View key={item.id} direction="row" gap={4} padding={3} backgroundColor="neutral-faded">
            <View width={80} height={80} position="relative">
              <img 
                src={item.product.photoUrl} 
                alt={item.product.name}
                style={{ objectFit: 'cover' }}
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
                    onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    -
                  </Button>
                  <Text variant="body-1">{item.quantity}</Text>
                  <Button 
                    variant="ghost" 
                    size="small"
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => handleRemoveItem(item.id)}
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
        <Text variant="title-2">{formatPrice(data.cart.total)}</Text>
      </View>
      
      <View direction="row" justify="end" gap={2}>
        <Link href="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Button variant="solid" onClick={handleCheckout}>Checkout</Button>
      </View>
    </View>
  );
} 