import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';

// This is a special endpoint for testing and initial admin setup
// It allows promoting a user to admin role using a secret key
export async function POST(request: NextRequest) {
  try {
    // Verify the request has a valid secret key
    const { email, secretKey } = await request.json();
    
    // Check required fields
    if (!email || !secretKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify the secret key matches our environment variable or a fallback for tests
    const validSecretKey = process.env.ADMIN_SECRET_KEY || 'test_secret_for_promotion';
    if (secretKey !== validSecretKey) {
      return NextResponse.json(
        { error: 'Invalid secret key' },
        { status: 401 }
      );
    }
    
    // Promote the user to admin using the AuthService
    const authService = AuthService.getInstance();
    const updatedUser = await authService.promoteToAdmin(email);
    
    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });
  } catch (error) {
    console.error('Admin promotion error:', error);
    return NextResponse.json(
      { error: 'Failed to promote user to admin' },
      { status: 500 }
    );
  }
} 