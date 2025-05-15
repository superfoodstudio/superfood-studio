'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

interface CartItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  photoUrl: string;
}

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  useEffect(() => {
    async function fetchCart() {
      if (!ready) return;
      
      try {
        setIsLoading(true);
        // In a real implementation, we would fetch the cart from the backend
        // Using a mock implementation for now
        const mockCart = [
          {
            id: '1',
            productName: 'Superfood Smoothie Mix',
            quantity: 2,
            price: 19.99,
            photoUrl: 'https://placehold.co/100',
          },
          {
            id: '2',
            productName: 'Organic Chia Seeds',
            quantity: 1,
            price: 12.99,
            photoUrl: 'https://placehold.co/100',
          },
        ];
        
        setCart(mockCart);
        calculateTotal(mockCart);
      } catch (error) {
        console.error('Error fetching cart', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCart();
  }, [ready]);
  
  function calculateTotal(items: CartItem[]) {
    const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotal(newTotal);
  }
  
  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    calculateTotal(updatedCart);
    
    // In a real implementation, we would update the cart in the backend
  }
  
  async function removeItem(itemId: string) {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
    calculateTotal(updatedCart);
    
    // In a real implementation, we would update the cart in the backend
  }
  
  async function proceedToCheckout() {
    if (!authenticated) {
      // Prompt user to login before checkout
      // You might want to save the cart to local storage and redirect after login
      alert("Please login to proceed with checkout");
      return;
    }
    
    router.push('/checkout');
  }
  
  if (isLoading) {
    return <div className="container mx-auto p-4">Loading your cart...</div>;
  }
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl mb-4">Your Cart</h1>
        <p>Your cart is empty.</p>
        <button 
          onClick={() => router.push('/')}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Your Cart</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left pb-4">Product</th>
              <th className="text-left pb-4">Price</th>
              <th className="text-left pb-4">Quantity</th>
              <th className="text-right pb-4">Subtotal</th>
              <th className="pb-4"></th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id} className="border-b">
                <td className="py-4">
                  <div className="flex items-center">
                    <img src={item.photoUrl} alt={item.productName} className="w-16 h-16 mr-4" />
                    <span>{item.productName}</span>
                  </div>
                </td>
                <td className="py-4">${item.price.toFixed(2)}</td>
                <td className="py-4">
                  <div className="flex items-center">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="border rounded-l px-2"
                    >
                      -
                    </button>
                    <span className="border-t border-b px-4">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="border rounded-r px-2"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                <td className="py-4 text-right">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between mb-2">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex justify-between border-t pt-2 mb-2">
          <span className="font-bold">Total</span>
          <span className="font-bold">${total.toFixed(2)}</span>
        </div>
        
        <button 
          onClick={proceedToCheckout}
          className="w-full bg-green-600 text-white mt-4 py-2 rounded hover:bg-green-700"
        >
          Proceed to Checkout
        </button>
      </div>
      
      <button 
        onClick={() => router.push('/')}
        className="text-green-600 hover:text-green-700"
      >
        ← Continue Shopping
      </button>
    </div>
  );
} 