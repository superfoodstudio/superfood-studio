'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Suspense } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  recommended?: boolean;
}

function SubscriptionContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const planParam = searchParams.get('plan');
  const { ready, authenticated, user } = usePrivy();

  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Monthly Subscription',
      price: 24.99,
      interval: 'month',
      features: [
        'Access to premium recipes',
        'Monthly superfood box',
        'Nutrition consultation',
        'Cancel anytime',
      ]
    },
    {
      id: 'yearly',
      name: 'Annual Subscription',
      price: 19.99,
      interval: 'year',
      features: [
        'Access to premium recipes',
        'Monthly superfood box',
        'Nutrition consultation',
        'Bonus welcome kit',
        'Free shipping on all orders',
      ],
      recommended: true
    }
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  // Set selected plan from URL parameter
  useEffect(() => {
    if (planParam && (planParam === 'monthly' || planParam === 'yearly')) {
      setSelectedPlan(planParam);
    }
  }, [planParam]);

  function handleSelectPlan(planId: string) {
    setSelectedPlan(planId);
  }

  async function handleSubscribe() {
    if (!selectedPlan) return;

    setIsLoading(true);

    try {
      // In a real implementation, we would call the subscription API
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard membership page (in real app, we'd redirect to Stripe)
      router.push('/dashboard/membership?success=true');
    } catch (error) {
      console.error('Subscription error:', error);
      alert('There was an error processing your subscription. Please try again.');
      setIsLoading(false);
    }
  }

  if (!ready || (ready && !authenticated)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-6">Choose Your Subscription Plan</h1>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-lg mb-4">Benefits of subscribing:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-green-600 mb-2">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Premium Recipes</h3>
              <p className="text-sm text-gray-600">
                Access to exclusive recipes and nutrition plans only available to subscribers.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-green-600 mb-2">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Monthly Superfood Box</h3>
              <p className="text-sm text-gray-600">
                Monthly delivery of our curated superfood products right to your doorstep.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="text-green-600 mb-2">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <h3 className="font-medium mb-2">Nutrition Consultation</h3>
              <p className="text-sm text-gray-600">
                Get personalized nutrition advice from our team of experts.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`border rounded-lg p-6 ${
                selectedPlan === plan.id 
                  ? 'border-green-600 ring-2 ring-green-600 ring-opacity-50' 
                  : 'hover:shadow-md'
              } ${
                plan.recommended 
                  ? 'relative overflow-hidden' 
                  : ''
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-green-600 text-white text-xs px-2 py-1 transform rotate-45 translate-x-2 -translate-y-3 w-32 text-center">
                  Best Value
                </div>
              )}
              <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
              <p className="text-3xl font-bold mb-4">
                ${plan.price.toFixed(2)}
                <span className="text-base font-normal text-gray-600">
                  /{plan.interval}
                </span>
              </p>
              {plan.id === 'yearly' && (
                <p className="text-green-600 mb-4">Save $60 per year</p>
              )}
              <ul className="mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-2 rounded text-center ${
                  selectedPlan === plan.id
                    ? 'bg-green-600 text-white' 
                    : 'bg-white border border-green-600 text-green-600 hover:bg-green-50'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl mb-4">Summary</h3>
          {!selectedPlan ? (
            <p>Please select a plan to continue.</p>
          ) : (
            <>
              <div className="flex justify-between mb-2">
                <span>Plan:</span>
                <span>{plans.find(p => p.id === selectedPlan)?.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Price:</span>
                <span>
                  ${plans.find(p => p.id === selectedPlan)?.price.toFixed(2)}/
                  {plans.find(p => p.id === selectedPlan)?.interval}
                </span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between mb-4">
                <span className="font-bold">Total:</span>
                <span className="font-bold">
                  ${
                    selectedPlan === 'yearly'
                      ? (19.99 * 12).toFixed(2)
                      : '24.99'
                  }
                </span>
              </div>
              <button
                onClick={handleSubscribe}
                disabled={isLoading}
                className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Subscribe Now'}
              </button>
              <p className="text-sm text-gray-600 mt-4">
                By subscribing, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription at any time from your profile.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-4 text-center">Loading subscription options...</div>}>
      <SubscriptionContent />
    </Suspense>
  );
} 