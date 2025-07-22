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
    
    try {
      const user = await authService.verifyToken(token);
      
      // Use the role directly from the user object we just fetched
      // Only fall back to getUserRole if user.role is not available
      let role = user.role;
      if (!role) {
        role = await authService.getUserRole(user.email, request.headers);
      }
      
      console.log('🔍 Final debug - User object:', user);
      console.log('🔍 Final debug - Role being returned:', role);
      
      return NextResponse.json({ role });
    } catch (tokenError) {
      console.error('Token verification error:', tokenError);
      return NextResponse.json({ role: 'PUBLIC', error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error getting user role:', error);
    return NextResponse.json({ role: 'PUBLIC' });
  }
} 