import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'sf-session';
const SESSION_TTL = 20 * 60 * 1000; // 20 minutes

interface SessionData {
  isAuthenticated: boolean;
  role?: string;
  subscriptionStatus?: string;
  ts: number;
}

function getSessionFromCookie(request: NextRequest): SessionData | null {
  const raw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const data: SessionData = JSON.parse(raw);
    if (Date.now() - data.ts > SESSION_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

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

  // Try the cached session first — avoids network calls on every navigation
  const cached = getSessionFromCookie(request);

  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Use cache if available
    if (cached) {
      if (!cached.isAuthenticated || cached.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }

    try {
      const user = await verifyAuthToken(authToken, request.nextUrl.origin);

      const session: SessionData = {
        isAuthenticated: user.isAuthenticated,
        role: user.role,
        ts: Date.now(),
      };

      if (!user.isAuthenticated || user.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const response = NextResponse.next();
      response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 300,
        path: '/',
      });
      return response;
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Subscriber content protection (Recipes & Shop)
  if (request.nextUrl.pathname.startsWith('/recipes') ||
      request.nextUrl.pathname.startsWith('/shop') ||
      request.nextUrl.pathname.startsWith('/livestream')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Use cache if available
    if (cached) {
      if (!cached.isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
      }
      if (cached.role === 'ADMIN') {
        return NextResponse.next();
      }
      if (cached.role === 'SUBSCRIBER' && cached.subscriptionStatus === 'ACTIVE') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/dashboard/membership', request.url));
    }

    try {
      const user = await verifyAuthToken(authToken, request.nextUrl.origin);

      if (!user.isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      const session: SessionData = {
        isAuthenticated: true,
        role: user.role,
        ts: Date.now(),
      };

      // Admin always has access
      if (user.role === 'ADMIN') {
        const response = NextResponse.next();
        response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 300,
          path: '/',
        });
        return response;
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
            session.subscriptionStatus = subscriptionData.subscription?.status;

            if (subscriptionData.subscription?.status === 'ACTIVE') {
              const response = NextResponse.next();
              response.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 300,
                path: '/',
              });
              return response;
            }
          }
        } catch (subscriptionError) {
          clearTimeout(subTimeoutId);
          // On timeout or error, allow access rather than blocking
          return NextResponse.next();
        }
      }

      return NextResponse.redirect(new URL('/dashboard/membership', request.url));
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
    '/shop/:path*',
    '/livestream/:path*'
  ],
  missing: [
    { type: 'header', key: 'next-router-prefetch' },
    { type: 'header', key: 'purpose', value: 'prefetch' },
  ],
};
