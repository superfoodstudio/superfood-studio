import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/relay/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Ensure CORS headers are set properly for Vercel deployment
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  console.log('GraphQL POST request received at:', new Date().toISOString());
  
  try {
    const { query, variables } = await request.json();
    console.log('Query parsed, length:', query?.length || 0);
    console.log('Variables count:', Object.keys(variables || {}).length);

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log('Starting query execution...');
    const data = await Promise.race([
      executeQuery(query, variables || {}, request),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('GraphQL execution timeout')), 25000)
      )
    ]);
    
    const duration = Date.now() - startTime;
    console.log(`Query executed successfully in ${duration}ms`);

    return NextResponse.json({ data });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`GraphQL API Error after ${duration}ms:`, error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
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
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
} 