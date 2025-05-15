import { NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

// Mark this route as dynamic since it uses headers
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Check for admin override test header
    const adminOverride = request.headers.get('X-Admin-Override');
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      // Even for public requests, check if we're using the admin test override
      if (adminOverride === 'true' && (process.env.NODE_ENV === 'test' || process.env.TESTING === 'true')) {
        return NextResponse.json({ role: 'ADMIN' });
      }
      return NextResponse.json({ role: 'PUBLIC' });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);
    
    // Pass the request headers to check for test override
    const role = await authService.getUserRole(user.email, request.headers);

    return NextResponse.json({ role });
  } catch (error) {
    console.error('Error getting user role:', error);
    return NextResponse.json({ role: 'PUBLIC' });
  }
} 