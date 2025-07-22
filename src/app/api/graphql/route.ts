import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/relay/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('GraphQL POST request received');
  try {
    const { query, variables } = await request.json();
    console.log('Query:', query?.substring(0, 100) + '...');
    console.log('Variables:', JSON.stringify(variables));

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const data = await executeQuery(query, variables || {}, request);
    console.log('Query executed successfully, data keys:', Object.keys(data || {}));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GraphQL API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
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