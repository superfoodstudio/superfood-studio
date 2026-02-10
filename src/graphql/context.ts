import { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyPrivyTokenFast, UserContext } from '@/lib/auth-utils';

export interface GraphQLContext {
  prisma: PrismaClient;
  user: UserContext;
  // Helper to get full user data when needed (lazy loaded)
  getFullUser: () => Promise<UserContext>;
}

export async function createContext({ req }: { req: any }): Promise<GraphQLContext> {
  const authToken = req.cookies?.['privy-token'] || req.headers?.authorization?.replace('Bearer ', '');
  
  // Fast token verification only (no DB queries)
  const user = authToken ? await verifyPrivyTokenFast(authToken) : { isAuthenticated: false };
  
  return {
    prisma,
    user,
    // Lazy loader for full user data when resolvers need it
    getFullUser: async () => {
      if (!authToken || !user.isAuthenticated) {
        return { isAuthenticated: false };
      }
      
      // Only fetch from DB when actually needed
      try {
        const { getUserFromPrivyToken } = await import('@/lib/auth-utils');
        return await getUserFromPrivyToken(authToken);
      } catch (error) {
        return { isAuthenticated: false };
      }
    }
  };
} 