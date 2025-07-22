import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/relay/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('GraphQL POST request received');
  try {
    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    const data = await executeQuery(query, variables || {}, request);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GraphQL API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 