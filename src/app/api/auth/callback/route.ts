'use server';

import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 400 });
    }

    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Auth callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 