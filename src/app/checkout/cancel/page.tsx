'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { ContentSkeleton } from '@/components/ui/ListSkeleton';

function CheckoutCancelContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Order Has Been Cancelled</h1>
          <p className="text-gray-600">
            {orderId 
              ? `Your order #${orderId} has been cancelled.` 
              : 'Your checkout process was cancelled.'
            }
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl mb-4">What Happens Next?</h2>
          <p className="mb-2">
            Your payment was not processed and no charges were made to your payment method.
          </p>
          <p className="mb-4">
            If you cancelled because of an issue with your order or if you have any questions, 
            please contact our customer support team.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link href="/cart" className="bg-white border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-50 text-center">
            Return to Cart
          </Link>
          <Link href="/" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4"><ContentSkeleton /></div>}>
      <CheckoutCancelContent />
    </Suspense>
  );
} 