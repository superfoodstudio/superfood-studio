import { graphql } from 'graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { recipeResolvers } from '@/graphql/resolvers/recipe';
import { productResolvers } from '@/graphql/resolvers/product';
import { createContext } from '@/graphql/context';

// Read schema files
const unifiedSchema = readFileSync(join(process.cwd(), 'src/graphql/schema.graphql'), 'utf-8');

// Create schema
const schema = makeExecutableSchema({
  typeDefs: [unifiedSchema],
  resolvers: [recipeResolvers, productResolvers],
});

export async function executeQuery(query: string, variables: Record<string, unknown>) {
  const context = await createContext();
  
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
    contextValue: context,
  });

  if (result.errors) {
    console.error('GraphQL Errors:', result.errors);
    throw new Error('GraphQL query failed');
  }

  return result.data;
} 