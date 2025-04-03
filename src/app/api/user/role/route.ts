import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ role: 'PUBLIC' });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);
    const role = await authService.getUserRole(user.email);

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error getting user role:', error);
    return NextResponse.json({ role: 'PUBLIC' });
  }
} 