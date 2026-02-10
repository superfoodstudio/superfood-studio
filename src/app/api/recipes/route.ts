import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { generateSlug } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);
    const role = await authService.getUserRole(user.email);

    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { name, description, mediaUrl } = await req.json();

    if (!name || !description || !mediaUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate a slug from the name
    const slug = generateSlug(name);

    // Create recipe in database
    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        slug,
        description,
        mediaUrl,
        category: 'food',
        isPublished: false,
        uploadDate: new Date(),
        ingredients: '',
        instructions: '',
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });

  } catch (error) {
    console.error('Create recipe error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 