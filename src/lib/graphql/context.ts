import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';

export interface Context {
  prisma: PrismaClient;
  user: {
    id: string;
    email: string;
    role: 'ADMIN' | 'SUBSCRIBER' | 'PUBLIC';
  } | null;
}

export async function createContext({ req }: { req: Request }): Promise<Context> {
  // For now, we'll return a null user context
  // The actual user authentication will happen on the client side with Privy
  // We'll update the user's role and details after they authenticate
  return {
    prisma,
    user: null,
  };
} 