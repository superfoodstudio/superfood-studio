import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Create a test recipe
    const recipe = await prisma.recipe.create({
      data: {
        name: 'Test Recipe',
        description: 'A test recipe to verify our GraphQL API',
        ingredients: [
          {
            name: 'Test Ingredient',
            quantity: '1',
            unit: 'piece',
          },
        ],
        steps: [
          {
            order: 1,
            description: 'Test step',
          },
        ],
        isPublished: true,
      },
    });

    return NextResponse.json({ success: true, recipe });
  } catch (error) {
    console.error('Test route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create test recipe' }, { status: 500 });
  }
} 