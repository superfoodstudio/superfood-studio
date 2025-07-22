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

    // Check if recipe exists
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id }
    });

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    // Check if rating exists, then create or update (avoiding transactions)
    let recipeRating = await prisma.recipeRating.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId: params.id
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
        recipe: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (recipeRating) {
      // Update existing rating
      recipeRating = await prisma.recipeRating.update({
        where: {
          userId_recipeId: {
            userId: user.id,
            recipeId: params.id
          }
        },
        data: {
          rating
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
          recipe: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    } else {
      // Create new rating
      recipeRating = await prisma.recipeRating.create({
        data: {
          rating,
          userId: user.id,
          recipeId: params.id
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
          recipe: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });
    }

    return NextResponse.json(recipeRating);
  } catch (error) {
    console.error('Error rating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to rate recipe' },
      { status: 500 }
    );
  }
}

// Get user's current rating for a recipe
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

    const recipeRating = await prisma.recipeRating.findUnique({
      where: {
        userId_recipeId: {
          userId: user.id,
          recipeId: params.id
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
        recipe: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({ rating: recipeRating });
  } catch (error) {
    console.error('Error fetching user recipe rating:', error);
    return NextResponse.json({ rating: null });
  }
}