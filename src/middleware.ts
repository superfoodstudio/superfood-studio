import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserFromPrivyToken } from '@/lib/auth-utils';

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);
  
  // Skip middleware for specific API routes to prevent circular dependencies
  if (request.nextUrl.pathname.startsWith('/api/user/role') || 
      request.nextUrl.pathname.startsWith('/api/subscription') ||
      request.nextUrl.pathname.startsWith('/api/auth/') ||
      request.nextUrl.pathname.startsWith('/api/webhooks/')) {
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
      // Use optimized auth function
      const user = await getUserFromPrivyToken(authToken);
      
      if (!user.isAuthenticated || user.role !== 'ADMIN') {
        console.log('Admin access denied, user role:', user.role);
        return NextResponse.redirect(new URL('/', request.url));
      }

      console.log('Admin access granted');
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
      // Use optimized auth function
      const user = await getUserFromPrivyToken(authToken);
      
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