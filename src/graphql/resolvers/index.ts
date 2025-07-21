import { recipeResolvers } from './recipe';
import { productResolvers } from './product';
import { cartResolvers } from './cart';
import { adminResolvers } from './admin';
import { subscriptionResolvers } from './subscription';
import { orderResolvers } from './order';
import { siteSettingsResolvers } from './siteSettings';
import { commentResolvers } from './comment';

export const resolvers = {
  Query: {
    ...recipeResolvers.Query,
    ...productResolvers.Query,
    ...cartResolvers.Query,
    ...adminResolvers.Query,
    ...subscriptionResolvers.Query,
    ...orderResolvers.Query,
    ...siteSettingsResolvers.Query,
    ...commentResolvers.Query,
  },
  Mutation: {
    ...recipeResolvers.Mutation,
    ...productResolvers.Mutation,
    ...cartResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...subscriptionResolvers.Mutation,
    ...siteSettingsResolvers.Mutation,
    ...commentResolvers.Mutation,
  },
  Comment: commentResolvers.Comment,
}; 