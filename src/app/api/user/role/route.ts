import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

// Mark this route as dynamic since it uses headers
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ role: 'PUBLIC' });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    
    try {
      const user = await authService.verifyToken(token);
      
      // Use the role directly from the user object we just fetched
      // Only fall back to getUserRole if user.role is not available
      let role = user.role;
      if (!role) {
        role = await authService.getUserRole(user.email, request.headers);
      }
      
      return NextResponse.json({ role });
    } catch (tokenError) {
      return NextResponse.json({ role: 'PUBLIC', error: 'Invalid token' });
    }
  } catch (error) {
    return NextResponse.json({ role: 'PUBLIC' });
  }
} 