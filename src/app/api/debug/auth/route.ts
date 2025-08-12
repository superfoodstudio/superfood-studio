import { NextRequest, NextResponse } from 'next/server';
import { getUserFromPrivyToken } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('privy-token')?.value;
  
  if (!authToken) {
    return NextResponse.json({
      error: 'No privy-token cookie found',
      hasCookie: false
    });
  }

  try {
    const user = await getUserFromPrivyToken(authToken);
    return NextResponse.json({
      user,
      hasToken: true,
      tokenLength: authToken.length
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      hasToken: true,
      tokenLength: authToken.length
    });
  }
}