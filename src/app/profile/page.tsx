'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [orders, setOrders] = useState<Order[]>([]);
  
  const router = useRouter();
  const { ready, authenticated, user, logout } = usePrivy();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);
  
  // Fetch profile data and order history
  useEffect(() => {
    async function fetchData() {
      if (!ready || !authenticated) return;
      
      try {
        setIsLoading(true);
        
        // In a real implementation, we would fetch from the API
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock profile data
        setProfile({
          firstName: user?.email?.address?.split('@')[0] || '',
          lastName: 'User',
          email: user?.email?.address || '',
          shippingAddress: {
            street: '123 Superfood St',
            city: 'Health City',
            state: 'CA',
            zipCode: '90210',
            country: 'US',
          },
        });
        
        // Mock order history
        setOrders([
          {
            id: 'ORD123456',
            date: '2023-10-15',
            status: 'Delivered',
            total: 65.69,
            items: [
              { id: '1', name: 'Superfood Smoothie Mix', quantity: 2, price: 19.99 },
              { id: '2', name: 'Organic Chia Seeds', quantity: 1, price: 12.99 }
            ]
          },
          {
            id: 'ORD123457',
            date: '2023-09-28',
            status: 'Delivered',
            total: 43.97,
            items: [
              { id: '3', name: 'Acai Bowl Kit', quantity: 1, price: 24.99 },
              { id: '4', name: 'Coconut Water', quantity: 3, price: 6.99 }
            ]
          }
        ]);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [ready, authenticated, user]);
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    
    // Handle nested shipping address fields
    if (name.startsWith('shipping.')) {
      const field = name.split('.')[1];
      setProfile({
        ...profile,
        shippingAddress: {
          ...profile.shippingAddress!,
          [field]: value,
        },
      });
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  }
  
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // In a real implementation, we would update the profile via API
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }
  
  async function handleLogout() {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
  if (!ready || isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4">Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (!authenticated) {
    return null; // This will be handled by the redirect in useEffect
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-6">My Account</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          {/* Sidebar Navigation */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="mb-6">
              <h2 className="font-bold mb-2">{profile.firstName} {profile.lastName}</h2>
              <p className="text-sm text-gray-600">{profile.email}</p>
            </div>
            
            <nav>
              <ul>
                <li className="mb-2">
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left p-2 rounded ${activeTab === 'profile' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}
                  >
                    Profile Settings
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left p-2 rounded ${activeTab === 'orders' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}
                  >
                    Order History
                  </button>
                </li>
                <li className="mb-2">
                  <button 
                    onClick={() => setActiveTab('subscription')}
                    className={`w-full text-left p-2 rounded ${activeTab === 'subscription' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}
                  >
                    Subscription
                  </button>
                </li>
                <li className="pt-4 mt-4 border-t">
                  <button 
                    onClick={handleLogout}
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        <div className="md:w-3/4">
          {/* Profile Settings Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">Profile Settings</h2>
              <form onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                
                <h3 className="text-lg mb-3 mt-6">Shipping Address</h3>
                <div className="mb-4">
                  <label className="block mb-1">Street Address</label>
                  <input
                    type="text"
                    name="shipping.street"
                    value={profile.shippingAddress?.street || ''}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">City</label>
                    <input
                      type="text"
                      name="shipping.city"
                      value={profile.shippingAddress?.city || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">State/Province</label>
                    <input
                      type="text"
                      name="shipping.state"
                      value={profile.shippingAddress?.state || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-1">ZIP/Postal Code</label>
                    <input
                      type="text"
                      name="shipping.zipCode"
                      value={profile.shippingAddress?.zipCode || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Country</label>
                    <input
                      type="text"
                      name="shipping.country"
                      value={profile.shippingAddress?.country || ''}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">Order History</h2>
              {orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
              ) : (
                <div>
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-lg mb-4 overflow-hidden">
                      <div className="bg-gray-50 p-4 flex justify-between border-b">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-gray-600">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                          <p className={`text-sm ${
                            order.status === 'Delivered' ? 'text-green-600' : 
                            order.status === 'Processing' ? 'text-blue-600' : 
                            order.status === 'Cancelled' ? 'text-red-600' : ''
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium mb-2">Items</h3>
                        <ul className="text-sm">
                          {order.items.map(item => (
                            <li key={item.id} className="flex justify-between py-1">
                              <span>{item.name} (x{item.quantity})</span>
                              <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">Subscription</h2>
              <div className="p-4 border rounded mb-6 bg-gray-50">
                <p className="text-center text-gray-600">
                  You don't have an active subscription.
                </p>
              </div>
              
              <h3 className="text-lg mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="text-xl font-medium mb-2">Monthly Subscription</h4>
                  <p className="text-3xl font-bold mb-2">$24.99<span className="text-base font-normal text-gray-600">/month</span></p>
                  <ul className="mb-4">
                    <li className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Access to premium recipes
                    </li>
                    <li className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Monthly superfood box
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Cancel anytime
                    </li>
                  </ul>
                  <button
                    onClick={() => router.push('/subscription?plan=monthly')}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Subscribe Monthly
                  </button>
                </div>
                
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-600 text-white text-xs px-2 py-1 transform rotate-45 translate-x-2 -translate-y-3 w-32 text-center">
                    Best Value
                  </div>
                  <h4 className="text-xl font-medium mb-2">Annual Subscription</h4>
                  <p className="text-3xl font-bold mb-2">$19.99<span className="text-base font-normal text-gray-600">/month</span></p>
                  <p className="text-green-600 mb-4">Save $60 per year</p>
                  <ul className="mb-4">
                    <li className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Access to premium recipes
                    </li>
                    <li className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Monthly superfood box
                    </li>
                    <li className="flex items-center mb-2">
                      <svg className="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Bonus welcome kit
                    </li>
                  </ul>
                  <button
                    onClick={() => router.push('/subscription?plan=yearly')}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Subscribe Yearly
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 