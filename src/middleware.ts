import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { prisma } from './lib/prisma';

export async function middleware(request: NextRequest) {
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
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

      // Check if user exists and has admin role directly from database
      const user = await prisma.user.findUnique({
        where: { email: userDetails.email.address },
        select: { role: true },
      });
      
      if (user?.role !== 'ADMIN') {
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
      const authToken = request.cookies.get('privy-token')?.value;
      
      if (!authToken) {
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
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // Check if user has an active subscription
      const user = await prisma.user.findUnique({
        where: { email: userDetails.email.address },
        include: { subscription: true }
      });
      
      if (!user || !user.subscription || user.subscription.status !== 'ACTIVE') {
        return NextResponse.redirect(new URL('/subscription', request.url));
      }
      
      return NextResponse.next();
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
}; 