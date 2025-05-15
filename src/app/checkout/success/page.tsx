'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CheckoutSuccessContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<{
    id: string;
    total: number;
    items: Array<{ name: string; quantity: number; price: number }>;
  } | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!sessionId || !orderId) return;
      
      try {
        setIsLoading(true);
        
        // In a real implementation, we would fetch the order details from the backend
        // For now, we're just simulating a delay and using mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock order data
        setOrderDetails({
          id: orderId,
          total: 65.69,
          items: [
            { name: 'Superfood Smoothie Mix', quantity: 2, price: 19.99 },
            { name: 'Organic Chia Seeds', quantity: 1, price: 12.99 }
          ]
        });
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchOrderDetails();
  }, [sessionId, orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl mb-4">Processing Your Order...</h1>
        <p>Please wait while we confirm your order details.</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl mb-4">Order Not Found</h1>
        <p>We couldn't find details for this order.</p>
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
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Thank You For Your Order!</h1>
          <p className="text-gray-600">
            Your order has been processed successfully. We've sent a confirmation email with your order details.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl mb-4 border-b pb-2">Order Details</h2>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Order Number:</span>
            <span>{orderDetails.id}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="font-medium">Order Date:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          
          <h3 className="font-medium mb-2">Items:</h3>
          <div className="border-t">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-b">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4 pt-2 font-bold">
            <span>Total:</span>
            <span>${orderDetails.total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4 text-center">Loading order details...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 