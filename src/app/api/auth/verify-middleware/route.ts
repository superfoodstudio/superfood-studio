import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ isAuthenticated: false });
    }

    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );

    // Verify token with Privy
    const verifiedUser = await privy.verifyAuthToken(token);
    const userDetails = await privy.getUser(verifiedUser.userId);

    if (!userDetails.email?.address) {
      return NextResponse.json({ isAuthenticated: false });
    }

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email: userDetails.email.address },
      select: { id: true, email: true, role: true }
    });

    const user = dbUser ? {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      isAuthenticated: true,
      privyUserId: verifiedUser.userId
    } : { isAuthenticated: false };

    return NextResponse.json(user);
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ isAuthenticated: false });
  }
}