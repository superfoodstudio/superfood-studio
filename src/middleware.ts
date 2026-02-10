import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

async function verifyAuthToken(token: string, origin: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${origin}/api/auth/verify-middleware`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return { isAuthenticated: false };
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    return { isAuthenticated: false };
  }
}

export async function middleware(request: NextRequest) {
  // Skip middleware for specific API routes to prevent circular dependencies
  if (request.nextUrl.pathname.startsWith('/api/user/role') || 
      request.nextUrl.pathname.startsWith('/api/subscription') ||
      request.nextUrl.pathname.startsWith('/api/auth/') ||
      request.nextUrl.pathname.startsWith('/api/webhooks/') ||
      request.nextUrl.pathname.startsWith('/api/debug/')) {
    return NextResponse.next();
  }
  
  const authToken = request.cookies.get('privy-token')?.value;
  
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Use API endpoint for auth verification
      const user = await verifyAuthToken(authToken, request.nextUrl.origin);

      if (!user.isAuthenticated || user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  // Subscriber content protection (Recipes & Shop)
  if (request.nextUrl.pathname.startsWith('/recipes') || 
      request.nextUrl.pathname.startsWith('/shop')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    try {
      // Use API endpoint for auth verification
      const user = await verifyAuthToken(authToken, request.nextUrl.origin);
      
      if (!user.isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Admin always has access
      if (user.role === 'ADMIN') {
        return NextResponse.next();
      }
      
      // For subscribers, check active subscription status via API
      if (user.role === 'SUBSCRIBER') {
        const subController = new AbortController();
        const subTimeoutId = setTimeout(() => subController.abort(), 5000);

        try {
          const subscriptionResponse = await fetch(`${request.nextUrl.origin}/api/subscription`, {
            headers: { 'Authorization': `Bearer ${authToken}` },
            signal: subController.signal,
          });
          clearTimeout(subTimeoutId);

          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            if (subscriptionData.subscription?.status === 'ACTIVE') {
              return NextResponse.next();
            }
          }
        } catch (subscriptionError) {
          clearTimeout(subTimeoutId);
          // On timeout or error, allow access rather than blocking
          return NextResponse.next();
        }
      }
      
      return NextResponse.redirect(new URL('/subscription', request.url));
    } catch (error) {
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