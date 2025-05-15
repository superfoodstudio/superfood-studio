import { prisma } from './prisma';
import { PrivyClient } from '@privy-io/server-auth';
import type { headers as NextHeaders } from 'next/headers';

export class AuthService {
  private static instance: AuthService;
  private privy: PrivyClient;

  private constructor() {
    if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID || !process.env.PRIVY_APP_SECRET) {
      throw new Error('Missing Privy environment variables');
    }

    this.privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID,
      process.env.PRIVY_APP_SECRET
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async verifyToken(token: string, requestHeaders?: Headers) {
    try {
      // First verify the token to get the user ID
      const verifiedClaims = await this.privy.verifyAuthToken(token);
      
      // Then get the user details using the user ID
      const userDetails = await this.privy.getUser(verifiedClaims.userId);
      
      if (!userDetails.email?.address) {
        throw new Error('No email found');
      }

      // Create or update user in database
      const user = await prisma.user.upsert({
        where: { email: userDetails.email.address },
        update: {},
        create: {
          email: userDetails.email.address,
          role: 'SUBSCRIBER',
        },
      });

      return user;
    } catch (error) {
      console.error('Auth verification error:', error);
      throw error;
    }
  }

  async getUserRole(email: string, requestHeaders?: Headers) {
    try {
      // Check for the test admin override header
      let adminOverride = false;
      
      // For browser requests, check the passed headers
      if (requestHeaders && requestHeaders.get('X-Admin-Test-Override') === 'true') {
        adminOverride = true;
      }
      
      // For testing only - return ADMIN role if the override header is present
      if (adminOverride && (process.env.NODE_ENV === 'test' || process.env.TESTING === 'true')) {
        console.log('⚠️ Using admin override for testing - NEVER USE IN PRODUCTION');
        return 'ADMIN';
      }
      
      const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true },
      });

      return user?.role || 'PUBLIC';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'PUBLIC';
    }
  }

  async promoteToAdmin(email: string) {
    try {
      const user = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      });

      return user;
    } catch (error) {
      console.error('Error promoting user to admin:', error);
      throw error;
    }
  }
} 