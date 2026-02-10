import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import { AuthService } from '@/lib/auth';

// Get user profile data
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const authToken = authHeader?.replace('Bearer ', '') || req.cookies.get('privy-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );
    
    try {
      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);
      
      if (!userDetails.email?.address) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }
      
      // Get user from database with their subscription
      const dbUser = await prisma.user.findUnique({
        where: { email: userDetails.email.address },
        include: { 
          subscription: true,
        }
      });
      
      if (!dbUser) {
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        );
      }
      
      // Return user profile with subscription status
      return NextResponse.json({
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        billingAddress: dbUser.billingAddress,
        shippingAddress: dbUser.shippingAddress,
        subscription: dbUser.subscription ? {
          status: dbUser.subscription.status,
          plan: dbUser.subscription.plan,
          startDate: dbUser.subscription.startDate,
          endDate: dbUser.subscription.endDate,
        } : null,
      });
      
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

interface ProfileUpdateBody {
  firstName?: string;
  lastName?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Update user profile data
export async function PATCH(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const authToken = authHeader?.replace('Bearer ', '') || req.cookies.get('privy-token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );
    
    try {
      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);
      
      if (!userDetails.email?.address) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }
      
      // Get user from database
      const dbUser = await prisma.user.findUnique({
        where: { email: userDetails.email.address }
      });
      
      if (!dbUser) {
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        );
      }
      
      // Parse request body
      const body: ProfileUpdateBody = await req.json();
      
      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          billingAddress: body.billingAddress,
          shippingAddress: body.shippingAddress,
        },
        include: {
          subscription: true,
        }
      });
      
      // Return updated user profile
      return NextResponse.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        billingAddress: updatedUser.billingAddress,
        shippingAddress: updatedUser.shippingAddress,
        subscription: updatedUser.subscription ? {
          status: updatedUser.subscription.status,
          plan: updatedUser.subscription.plan,
          startDate: updatedUser.subscription.startDate,
          endDate: updatedUser.subscription.endDate,
        } : null,
      });
      
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Extract the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const authService = AuthService.getInstance();
      const user = await authService.verifyToken(token);
      const userId = user.id;

      // Parse request body
      const { firstName, lastName, shippingAddress, billingAddress } = await request.json();

      // Validate input
      if (!firstName && !lastName && !shippingAddress && !billingAddress) {
        return NextResponse.json(
          { error: 'No update data provided' },
          { status: 400 }
        );
      }

      // Prepare update data
      const updateData: any = {};

      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (shippingAddress) updateData.shippingAddress = shippingAddress;
      if (billingAddress) updateData.billingAddress = billingAddress;

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          billingAddress: true,
          shippingAddress: true,
          updatedAt: true,
        },
      });

      return NextResponse.json({ profile: updatedUser });
    } catch (authError) {
      console.error('Auth error in profile PUT:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
  } catch (error) {
    console.error('Profile PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 