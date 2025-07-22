import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);

    const { rating } = await request.json();
    
    // Validate rating is between 1-5
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json(
        { error: 'Rating must be an integer between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Create or update the user's rating for this product
    const productRating = await prisma.productRating.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.id
        }
      },
      update: {
        rating
      },
      create: {
        rating,
        userId: user.id,
        productId: params.id
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(productRating);
  } catch (error) {
    console.error('Error rating product:', error);
    return NextResponse.json(
      { error: 'Failed to rate product' },
      { status: 500 }
    );
  }
}

// Get user's current rating for a product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ rating: null });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);

    const productRating = await prisma.productRating.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.id
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({ rating: productRating });
  } catch (error) {
    console.error('Error fetching user product rating:', error);
    return NextResponse.json({ rating: null });
  }
}