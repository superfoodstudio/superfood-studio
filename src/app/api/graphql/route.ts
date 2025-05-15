import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/relay/server';

export async function POST(request: NextRequest) {
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