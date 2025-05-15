'use server';

import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { privyToken } = await request.json();
    
    if (!privyToken) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(privyToken);

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
} 