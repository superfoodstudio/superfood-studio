import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

// This is a special endpoint for testing and initial admin setup
// It allows promoting a user to admin role using a secret key
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 attempts per 15 minutes
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed, remaining } = checkRateLimit(ip, 5, 900000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    // Verify the request has a valid secret key
    const { email, secretKey } = await request.json();
    
    // Check required fields
    if (!email || !secretKey) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Verify the secret key matches our environment variable
    const validSecretKey = process.env.ADMIN_SECRET_KEY;
    if (!validSecretKey || secretKey !== validSecretKey) {
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