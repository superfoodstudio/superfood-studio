import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';

export async function middleware(request: NextRequest) {
  // Only run middleware on admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  try {
    const authToken = request.cookies.get('privy-token')?.value;
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );

    const verifiedUser = await privy.verifyAuthToken(authToken);
    const userDetails = await privy.getUser(verifiedUser.userId);

    if (!userDetails.email?.address) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Check if user exists and has admin role in your database
    const response = await fetch(`${request.nextUrl.origin}/api/user/role`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const { role } = await response.json();
    
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/admin/:path*',
}; 