import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';

export interface UserContext {
  id?: string;
  email?: string;
  role?: 'ADMIN' | 'SUBSCRIBER' | 'PUBLIC';
  isAuthenticated: boolean;
}

export interface GraphQLContext {
  prisma: PrismaClient;
  user: UserContext;
}

export async function createContext({ req }: { req: any }): Promise<GraphQLContext> {
  let user: UserContext = { isAuthenticated: false };

  try {
    const authToken = req.cookies?.['privy-token'] || req.headers?.authorization?.replace('Bearer ', '');
    
    if (authToken) {
      const privy = new PrivyClient(
        process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        process.env.PRIVY_APP_SECRET!
      );

      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);

      if (userDetails.email?.address) {
        // Check if user exists in our database
        const dbUser = await prisma.user.findUnique({
          where: { email: userDetails.email.address }
        });

        if (dbUser) {
          user = {
            id: dbUser.id,
            email: dbUser.email,
            role: dbUser.role as 'ADMIN' | 'SUBSCRIBER' | 'PUBLIC',
            isAuthenticated: true
          };
        }
      }
    }
  } catch (error) {
    // Authentication failed silently
    console.error('Authentication error:', error);
  }

  return {
    prisma,
    user
  };
} 