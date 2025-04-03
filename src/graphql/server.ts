import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { readFileSync } from 'fs';
import { join } from 'path';
import { recipeResolvers } from './resolvers/recipe';
import { createContext } from './context';

// Read schema files
const recipeSchema = readFileSync(join(process.cwd(), 'src/graphql/schema/recipe.graphql'), 'utf-8');

// Create schema
const schema = makeExecutableSchema({
  typeDefs: [recipeSchema],
  resolvers: [recipeResolvers],
});

// Create Apollo Server
const server = new ApolloServer({
  schema,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return error;
  },
});

// Create handler
const handler = startServerAndCreateNextHandler(server, {
  context: async () => createContext(),
});

export { handler as GET, handler as POST }; 