import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { recipeResolvers } from '@/graphql/resolvers/recipe';
import { productResolvers } from '@/graphql/resolvers/product';
import { cartResolvers } from '@/graphql/resolvers/cart';
import { createContext } from '@/graphql/context';
import { NextRequest } from 'next/server';

// Read schema files
const unifiedSchema = readFileSync(join(process.cwd(), 'src/graphql/schema.graphql'), 'utf-8');

// Create schema
const schema = makeExecutableSchema({
  typeDefs: [unifiedSchema],
  resolvers: [recipeResolvers, productResolvers, cartResolvers],
});

export async function executeQuery(
  query: string, 
  variables: Record<string, unknown>, 
  request?: NextRequest
) {
  // Create a request object for the context
  // If a request is provided, use its headers and cookies
  const req = {
    headers: request ? Object.fromEntries(request.headers) : {},
    cookies: request?.cookies 
      ? Object.fromEntries(request.cookies.getAll().map(c => [c.name, c.value])) 
      : {}
  };
  
  const context = await createContext({ req });
  
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context,
  });

  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    return { errors: result.errors.map(e => e.message) };
  }

  return result.data;
} 