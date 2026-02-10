import { PrivyClient } from '@privy-io/server-auth';
import { prisma } from '@/lib/prisma';

export interface UserContext {
  id?: string;
  email?: string;
  role?: 'ADMIN' | 'SUBSCRIBER' | 'PUBLIC';
  isAuthenticated: boolean;
  privyUserId?: string;
}

// Cache for user data to avoid repeated DB queries
const userCache = new Map<string, { user: UserContext; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000;

function evictExpiredEntries() {
  if (userCache.size <= MAX_CACHE_SIZE) return;
  const now = Date.now();
  for (const [key, value] of userCache) {
    if (now - value.timestamp >= CACHE_TTL) {
      userCache.delete(key);
    }
  }
  // If still over limit, remove oldest entries
  if (userCache.size > MAX_CACHE_SIZE) {
    const entries = [...userCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    const toRemove = entries.slice(0, entries.length - MAX_CACHE_SIZE);
    for (const [key] of toRemove) {
      userCache.delete(key);
    }
  }
}

export async function getUserFromPrivyToken(token: string): Promise<UserContext> {
  try {
    // Check cache first
    const cached = userCache.get(token);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.user;
    }

    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );

    // Verify token with Privy (this is fast, no external API call needed)
    const verifiedUser = await privy.verifyAuthToken(token);
    
    // Get user details from Privy (cached by Privy SDK)
    const userDetails = await privy.getUser(verifiedUser.userId);

    if (!userDetails.email?.address) {
      return { isAuthenticated: false };
    }

    // Only hit DB if we need role information - with proper error handling
    let dbUser = null;
    try {
      // Ensure we're in a server environment
      if (typeof window === 'undefined') {
        const { prisma } = await import('@/lib/prisma');
        dbUser = await prisma.user.findUnique({
          where: { email: userDetails.email.address },
          select: { id: true, email: true, role: true }
        });
      } else {
        return { isAuthenticated: false };
      }
    } catch (dbError) {
      return { isAuthenticated: false };
    }

    const user: UserContext = dbUser ? {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as 'ADMIN' | 'SUBSCRIBER' | 'PUBLIC',
      isAuthenticated: true,
      privyUserId: verifiedUser.userId
    } : { isAuthenticated: false };

    // Cache the result (with eviction to prevent memory leaks)
    evictExpiredEntries();
    userCache.set(token, { user, timestamp: Date.now() });

    return user;
  } catch (error) {
    return { isAuthenticated: false };
  }
}

// Lightweight token verification for GraphQL context
export async function verifyPrivyTokenFast(token: string): Promise<UserContext> {
  try {
    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );

    // Just verify the token is valid, don't fetch user details
    const verifiedUser = await privy.verifyAuthToken(token);
    
    // Return minimal context - resolvers can fetch more data if needed
    return {
      isAuthenticated: true,
      privyUserId: verifiedUser.userId
    };
  } catch (error) {
    return { isAuthenticated: false };
  }
}

// Clear cache when needed
export function clearUserCache(token?: string) {
  if (token) {
    userCache.delete(token);
  } else {
    userCache.clear();
  }
}