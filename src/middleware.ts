import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifyAuthToken(token: string, origin: string) {
  try {
    const response = await fetch(`${origin}/api/auth/verify-middleware`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      return { isAuthenticated: false };
    }
    
    return await response.json();
  } catch (error) {
    console.error('Auth verification error:', error);
    return { isAuthenticated: false };
  }
}

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);
  
  // Skip middleware for specific API routes to prevent circular dependencies
  if (request.nextUrl.pathname.startsWith('/api/user/role') || 
      request.nextUrl.pathname.startsWith('/api/subscription') ||
      request.nextUrl.pathname.startsWith('/api/auth/') ||
      request.nextUrl.pathname.startsWith('/api/webhooks/') ||
      request.nextUrl.pathname.startsWith('/api/debug/')) {
    return NextResponse.next();
  }
  
  const authToken = request.cookies.get('privy-token')?.value;
  console.log('Auth token exists:', !!authToken);
  
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!authToken) {
      console.log('Admin access: No auth token');
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Use API endpoint for auth verification
      const user = await verifyAuthToken(authToken, request.nextUrl.origin);
      console.log('Admin middleware - user data:', user);
      
      if (!user.isAuthenticated || user.role !== 'ADMIN') {
        console.log('Admin access denied, user role:', user.role, 'authenticated:', user.isAuthenticated);
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('Admin access granted to user:', user.email);
      return NextResponse.next();
    } catch (error) {
      console.error('Admin middleware error:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Subscriber content protection (Recipes & Shop)
  if (request.nextUrl.pathname.startsWith('/recipes') || 
      request.nextUrl.pathname.startsWith('/shop')) {
    if (!authToken) {
      console.log('Subscriber content: No auth token');
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Use API endpoint for auth verification
      const user = await verifyAuthToken(authToken, request.nextUrl.origin);
      
      if (!user.isAuthenticated) {
        console.log('Subscriber content: Not authenticated');
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Admin always has access
      if (user.role === 'ADMIN') {
        console.log('Access granted to admin');
        return NextResponse.next();
      }
      
      // For subscribers, check active subscription status via API
      if (user.role === 'SUBSCRIBER') {
        try {
          const subscriptionResponse = await fetch(`${request.nextUrl.origin}/api/subscription`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
          });
          
          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            if (subscriptionData.subscription?.status === 'ACTIVE') {
              console.log('Access granted to active subscriber');
              return NextResponse.next();
            }
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