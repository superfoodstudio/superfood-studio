'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
  });
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  // Redirect if not authenticated
  if (ready && !authenticated) {
    router.push('/cart');
    return null;
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real implementation, we would send the checkout data to the backend
      // and redirect to Stripe Checkout with the returned session URL
      console.log('Checkout data:', formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful checkout
      router.push('/checkout/success?session_id=mock_session_id&order_id=mock_order_id');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your payment. Please try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl mb-4">Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">State/Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-1">ZIP/Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1">Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="MX">Mexico</option>
                </select>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl mb-4">Payment Method</h2>
              <p className="text-sm text-gray-600 mb-4">
                You will be redirected to our secure payment provider to complete your purchase.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Complete Purchase'}
              </button>
            </div>
          </form>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl mb-4">Order Summary</h2>
            <div className="mb-4 border-b pb-4">
              <div className="flex justify-between mb-2">
                <span>Superfood Smoothie Mix (2)</span>
                <span>$39.98</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Organic Chia Seeds (1)</span>
                <span>$12.99</span>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>$52.97</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>$7.95</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>$4.77</span>
            </div>
            <div className="flex justify-between pt-2 mt-2 border-t">
              <span className="font-bold">Total</span>
              <span className="font-bold">$65.69</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/cart')}
            className="text-green-600 hover:text-green-700"
          >
            ← Return to Cart
          </button>
        </div>
      </div>
    </div>
  );
} 