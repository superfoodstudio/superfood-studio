import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware adds testing capabilities for API endpoints
export function middleware(request: NextRequest) {
  // For testing purposes only - allows bypassing authentication in test environments
  // This should NEVER be enabled in production
  const isTestEnvironment = process.env.NODE_ENV === 'test' || process.env.TESTING === 'true';
  const adminOverride = request.headers.get('X-Admin-Override');
  
  if (isTestEnvironment && adminOverride === 'true') {
    // Add a special header that our API routes can check to grant admin access for testing
    const headers = new Headers(request.headers);
    headers.set('X-Admin-Test-Override', 'true');
    
    // Create a new request with the modified headers
    const newRequest = {
      ...request,
      headers
    };
    
    // Log that we're using the admin override for testing
    console.log('⚠️ WARNING: Using admin test override. Never enable in production!');
    
    return NextResponse.next({
      request: newRequest as any
    });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
}; 