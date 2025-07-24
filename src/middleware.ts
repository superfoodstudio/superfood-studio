import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

// Helper function to safely fetch and parse JSON from API routes
async function safeFetchJson(url: string, options: RequestInit = {}) {
  try {
    console.log('Fetching from:', url);
    const response = await fetch(url, options);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const responseText = await response.text();
      console.log('Error response body:', responseText.substring(0, 200));
      return { success: false, status: response.status, error: responseText };
    }

    const responseText = await response.text();
    console.log('Response body (first 200 chars):', responseText.substring(0, 200));
    
    const data = JSON.parse(responseText);
    return { success: true, data };
  } catch (error) {
    console.error('Fetch error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Import prisma conditionally to prevent browser bundling issues
let prisma: any;
if (typeof window === 'undefined') {
  // Only import on server side
  import('./lib/prisma').then(module => {
    prisma = module.prisma;
  });
}

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);
  
  // Skip middleware for specific API routes to prevent circular dependencies
  if (request.nextUrl.pathname.startsWith('/api/user/role') || 
      request.nextUrl.pathname.startsWith('/api/subscription') ||
      request.nextUrl.pathname.startsWith('/api/auth/') ||
      request.nextUrl.pathname.startsWith('/api/webhooks/')) {
    return NextResponse.next();
  }
  
  // Log all cookies to help with debugging
  console.log('All cookies:', request.cookies.getAll().map(c => `${c.name}`).join(', '));
  // Check if Privy token exists
  const privyToken = request.cookies.get('privy-token');
  console.log('Privy token exists:', !!privyToken);
  
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    try {
      const authToken = request.cookies.get('privy-token')?.value;
      if (!authToken) {
        console.log('Admin access: No auth token');
        return NextResponse.redirect(new URL('/', request.url));
      }

      const privy = new PrivyClient(
        process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        process.env.PRIVY_APP_SECRET!
      );

      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);

      if (!userDetails.email?.address) {
        console.log('Admin access: No email');
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Check if user exists and has admin role using edge function
      // Since Prisma might not be available, we'll use the user role API instead
      const roleResult = await safeFetchJson(`${request.nextUrl.origin}/api/user/role`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!roleResult.success) {
        console.log('Failed to fetch user role for admin access:', roleResult.error);
        return NextResponse.redirect(new URL('/', request.url));
      }

      const roleData = roleResult.data;
      
      console.log('Admin access: User role =', roleData.role);
      
      if (roleData.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Subscriber content protection (Recipes & Shop)
  if (request.nextUrl.pathname.startsWith('/recipes') || 
      request.nextUrl.pathname.startsWith('/shop')) {
    try {
      console.log('Subscriber content access check');
      
      const authToken = request.cookies.get('privy-token')?.value;
      
      if (!authToken) {
        console.log('Subscriber content: No auth token');
        // Redirect to login without query parameters
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      const privy = new PrivyClient(
        process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        process.env.PRIVY_APP_SECRET!
      );
      
      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);
      
      if (!userDetails.email?.address) {
        console.log('Subscriber content: No email');
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Check user role using API instead of Prisma directly
      const roleResult = await safeFetchJson(`${request.nextUrl.origin}/api/user/role`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (!roleResult.success) {
        console.log('Failed to fetch user role:', roleResult.error);
        return NextResponse.redirect(new URL('/', request.url));
      }

      const roleData = roleResult.data;
      
      console.log('Subscriber content: User role =', roleData.role);
      
      // Admin always has access
      if (roleData.role === 'ADMIN') {
        console.log('Access granted to admin');
        return NextResponse.next();
      }
      
      // For subscribers, check active subscription status
      if (roleData.role === 'SUBSCRIBER') {
        try {
          const subscriptionResult = await safeFetchJson(`${request.nextUrl.origin}/api/subscription`, {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          });
          
          if (!subscriptionResult.success) {
            console.log('Failed to fetch subscription data:', subscriptionResult.error);
            console.log('Access denied - redirecting to subscription page');
            return NextResponse.redirect(new URL('/subscription', request.url));
          }

          const subscriptionData = subscriptionResult.data;
          
          console.log('Subscription data:', subscriptionData);
          
          // Check if subscription exists and is active
          if (subscriptionData.subscription && subscriptionData.subscription.status === 'ACTIVE') {
            console.log('Access granted to active subscriber');
            return NextResponse.next();
          }
        } catch (subscriptionError) {
          console.error('Error checking subscription:', subscriptionError);
        }
      }
      
      console.log('Access denied - redirecting to subscription page');
      return NextResponse.redirect(new URL('/subscription', request.url));
    } catch (error) {
      console.error('Subscriber content middleware error:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/recipes/:path*',
    '/shop/:path*'
  ],
  // Exclude API routes from middleware processing
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
}; 