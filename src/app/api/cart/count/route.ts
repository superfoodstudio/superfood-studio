import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createContext } from '@/graphql/context';

export async function GET(request: Request) {
  try {
    // Build context with auth info
    const req = {
      headers: Object.fromEntries(request.headers),
      cookies: {} as Record<string, string>
    };

    // Get the cookie header
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      // Parse cookies
      cookieHeader.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          req.cookies[name] = value;
        }
      });
    }

    const context = await createContext({ req });
    const { prisma, user } = context;

    let count = 0;

    if (user.isAuthenticated && user.id) {
      // Get authenticated user's cart
      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: { 
          items: true 
        }
      });
      
      if (cart) {
        count = cart.items.reduce((total: number, item: any) => total + item.quantity, 0);
      }
    } else {
      // For demonstration, we'll return a count based on localStorage
      // In a real app, you'd use a guest cart ID from cookies
      count = 0;
    }

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching cart count:', error);
    return NextResponse.json({ error: 'Failed to get cart count' }, { status: 500 });
  }
} 