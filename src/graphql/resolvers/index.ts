import { recipeResolvers } from './recipe';
import { productResolvers } from './product';
import { cartResolvers } from './cart';

export const resolvers = {
  Query: {
    ...recipeResolvers.Query,
    ...productResolvers.Query,
    ...cartResolvers.Query,
  },
  Mutation: {
    ...recipeResolvers.Mutation,
    ...productResolvers.Mutation,
    ...cartResolvers.Mutation,
  },
}; 