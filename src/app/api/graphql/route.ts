import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/relay/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// CORS headers — restrict to production domain
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';
const corsHeaders = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
  try {
    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const data = await Promise.race([
      executeQuery(query, variables || {}, request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('GraphQL execution timeout')), 25000)
      )
    ]);

    return NextResponse.json({ data });
  } catch (error) {
    // Return timeout-specific error for 504 issues
    if (error instanceof Error && error.message.includes('timeout')) {
      return NextResponse.json(
        { 
          error: 'Request timeout',
          details: process.env.NODE_ENV === 'development' ? error.message : 'GraphQL query timed out'
        },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : String(error) : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const variablesParam = searchParams.get('variables');

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    let variables = {};
    if (variablesParam) {
      try {
        variables = JSON.parse(variablesParam);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid variables parameter' },
          { status: 400 }
        );
      }
    }

    const data = await executeQuery(query, variables, request);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GraphQL API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
} 