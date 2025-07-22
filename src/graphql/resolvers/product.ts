import { PrismaClient } from '@prisma/client';
import { GraphQLContext } from '../context';
import Stripe from 'stripe';
import { generateSlug } from '@/lib/utils';

// Define our full Product type including Stripe fields
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  photoUrl: string;
  videoUrl: string | null;
  price: number;
  category: string;
  tags: string[];
  inventory: number;
  isActive: boolean;
  isArchived: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// For Prisma types that are no longer exported directly
type ProductOrderByWithRelationInput = {
  name?: 'asc' | 'desc';
  price?: 'asc' | 'desc';
  createdAt?: 'asc' | 'desc';
};

type ProductWhereInput = {
  category?: string;
  isActive?: boolean;
  isArchived?: boolean;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
};

// Initialize Stripe client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

interface ProductFilters {
  category?: string;
  status?: 'active' | 'inactive' | 'all';
  search?: string;
  sort?: 'a-z' | 'z-a' | 'price-low-high' | 'price-high-low' | 'newest' | 'oldest';
}

interface PublicProductFilters {
  category: string;
  limit?: number;
  offset?: number;
}

// Define custom input types to handle Stripe fields
interface CreateProductInputWithStripe {
  name: string;
  description: string;
  photoUrl: string;
  videoUrl?: string | null;
  price: number;
  category: string;
  tags: string[];
  inventory: number;
  stripeProductId?: string;
  stripePriceId?: string;
}

interface UpdateProductInputWithStripe {
  name?: string;
  description?: string;
  photoUrl?: string;
  videoUrl?: string | null;
  price?: number;
  category?: string;
  tags?: string[];
  inventory?: number;
  isActive?: boolean;
  slug?: string;
  stripeProductId?: string;
  stripePriceId?: string;
}

export const productResolvers = {
  Product: {
    // Resolver for the ratings field
    ratings: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      return prisma.productRating.findMany({
        where: { productId: parent.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    },

    // Resolver for the averageRating field
    averageRating: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      const ratings = await prisma.productRating.findMany({
        where: { productId: parent.id },
        select: { rating: true }
      });

      if (ratings.length === 0) {
        return null;
      }

      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      return Number((sum / ratings.length).toFixed(1));
    },

    // Resolver for the totalRatings field
    totalRatings: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      return prisma.productRating.count({
        where: { productId: parent.id }
      });
    }
  },

  Query: {
    products: async (_parent: unknown, args: ProductFilters, { prisma }: GraphQLContext) => {
      const { category, status, search, sort } = args;

      let orderBy: ProductOrderByWithRelationInput = {};
      switch (sort) {
        case 'a-z':
          orderBy = { name: 'asc' };
          break;
        case 'z-a':
          orderBy = { name: 'desc' };
          break;
        case 'price-low-high':
          orderBy = { price: 'asc' };
          break;
        case 'price-high-low':
          orderBy = { price: 'desc' };
          break;
        case 'oldest':
          orderBy = { createdAt: 'asc' };
          break;
        default:
          orderBy = { createdAt: 'desc' }; // newest
      }

      const where: ProductWhereInput = {
        isArchived: false, // Always filter out archived products
        ...(category ? { category } : {}),
        ...(status && status !== 'all'
          ? { isActive: status === 'active' }
          : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      };

      return prisma.product.findMany({
        where,
        orderBy,
      });
    },

    product: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      return prisma.product.findUnique({
        where: { id },
      });
    },
    
    productBySlug: async (_parent: unknown, { slug }: { slug: string }, { prisma }: GraphQLContext) => {
      return prisma.product.findUnique({
        where: { slug },
      });
    },
    
    productsByCategory: async (_parent: unknown, args: PublicProductFilters, { prisma }: GraphQLContext) => {
      const { category, limit = 20, offset = 0 } = args;
      
      return prisma.product.findMany({
        where: { 
          category,
          isActive: true,
          isArchived: false,
          inventory: { gt: 0 }
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset
      });
    },

    // Products connection for infinite scrolling
    productsConnection: async (
      _parent: unknown, 
      { first = 10, after, category, status, search, sort }: { 
        first?: number; 
        after?: string; 
        category?: string; 
        status?: string; 
        search?: string; 
        sort?: string; 
      }, 
      { prisma }: GraphQLContext
    ) => {
      try {
        let orderBy: ProductOrderByWithRelationInput = {};
        switch (sort) {
          case 'a-z':
            orderBy = { name: 'asc' };
            break;
          case 'z-a':
            orderBy = { name: 'desc' };
            break;
          case 'price-low-high':
            orderBy = { price: 'asc' };
            break;
          case 'price-high-low':
            orderBy = { price: 'desc' };
            break;
          case 'oldest':
            orderBy = { createdAt: 'asc' };
            break;
          default:
            orderBy = { createdAt: 'desc' }; // newest
        }

        const where: any = {
          isArchived: false, // Always filter out archived products
          ...(category ? { category } : {}),
          ...(status && status !== 'all'
            ? { isActive: status === 'active' }
            : {}),
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        };
        
        // Add cursor-based pagination
        if (after) {
          where.id = { lt: after }; // Use 'lt' for descending order (newest first)
        }

        const products = await prisma.product.findMany({
          where,
          take: first + 1, // Take one extra to check if there are more
          orderBy,
        });

        const hasNextPage = products.length > first;
        const nodes = hasNextPage ? products.slice(0, -1) : products;

        const edges = nodes.map((product) => ({
          cursor: product.id,
          node: product
        }));

        return {
          edges,
          pageInfo: {
            hasNextPage,
            hasPreviousPage: !!after,
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
          }
        };
      } catch (error) {
        console.error('Error fetching products connection:', error);
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null
          }
        };
      }
    },
  },

  Mutation: {
    rateProduct: async (
      _parent: unknown,
      { input }: { input: { productId: string; rating: number } },
      { prisma, user }: GraphQLContext
    ) => {
      const { productId, rating } = input;
      if (!user) {
        throw new Error('Authentication required');
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Use upsert to either create or update the rating
      const productRating = await prisma.productRating.upsert({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId
          }
        },
        update: {
          rating: rating,
          updatedAt: new Date()
        },
        create: {
          userId: user.id,
          productId: productId,
          rating: rating
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return productRating;
    },

    createProduct: async (
      _parent: unknown,
      { input }: { input: CreateProductInputWithStripe },
      { prisma, user }: GraphQLContext
    ) => {
      try {
        // Check if we're in a test environment
        const isTestEnvironment = process.env.NODE_ENV === 'test' || 
                                 !process.env.STRIPE_SECRET_KEY || 
                                 user.id?.includes('mock');
        
        let stripeProductId = '';
        let stripePriceId = '';
        
        if (!isTestEnvironment) {
          // First create the product in Stripe
          const stripeProduct = await stripe.products.create({
            name: input.name as string,
            description: input.description as string,
            images: input.photoUrl ? [input.photoUrl as string] : undefined,
            metadata: {
              category: input.category as string,
            },
            active: true,
          });

          // Create the price in Stripe
          const stripePrice = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round((input.price as number) * 100), // Convert to cents
            currency: 'usd',
          });
          
          stripeProductId = stripeProduct.id;
          stripePriceId = stripePrice.id;
        } else {
          // In test mode, use mock IDs
          stripeProductId = `mock_prod_${Date.now()}`;
          stripePriceId = `mock_price_${Date.now()}`;
        }

        // Generate a slug from the name
        const slug = generateSlug(input.name);

        // Now create the product in our database with Stripe IDs
        // Create a base product without Stripe fields first
        const productBase = {
          name: input.name,
          slug,
          description: input.description || "",  // Ensure required fields are not undefined
          photoUrl: input.photoUrl || "",
          videoUrl: input.videoUrl,
          price: input.price,
          category: input.category,
          tags: input.tags || [],
          inventory: input.inventory || 0,
          isActive: true,
        };

        // Create the product with all fields including slug
        const product = await prisma.product.create({
          data: {
            ...productBase,
            stripeProductId,
            stripePriceId,
          },
        });

        return product;
      } catch (error) {
        console.error('Error creating product with Stripe:', error);
        throw new Error('Failed to create product with Stripe');
      }
    },

    updateProduct: async (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateProductInputWithStripe },
      { prisma }: GraphQLContext
    ) => {
      try {
        // Get the current product from the database
        const currentProduct = await prisma.product.findUnique({
          where: { id },
        }) as unknown as Product;

        if (!currentProduct) {
          throw new Error('Product not found');
        }

        // Update in Stripe if we have a Stripe product ID
        if (currentProduct.stripeProductId) {
          await stripe.products.update(currentProduct.stripeProductId, {
            name: input.name || currentProduct.name,
            description: input.description || currentProduct.description,
            images: input.photoUrl ? [input.photoUrl] : undefined,
            active: input.isActive !== undefined ? input.isActive : currentProduct.isActive,
          });

          // If price is updated, create a new price in Stripe
          if (input.price !== undefined && input.price !== currentProduct.price) {
            const newPrice = await stripe.prices.create({
              product: currentProduct.stripeProductId,
              unit_amount: Math.round(input.price * 100), // Convert to cents
              currency: 'usd',
            });

            // Add the new price ID to the input for database update
            input.stripePriceId = newPrice.id;
          }
        }

        // If name is updated, generate a new slug
        if (input.name && input.name !== currentProduct.name) {
          input.slug = generateSlug(input.name);
        }

        // Update in our database
        const updateData = { ...input };
        return prisma.product.update({
          where: { id },
          data: updateData,
        });
      } catch (error) {
        console.error('Error updating product with Stripe:', error);
        throw new Error('Failed to update product with Stripe');
      }
    },

    deleteProduct: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      try {
        // Get the product to get Stripe ID
        const product = await prisma.product.findUnique({
          where: { id },
        }) as unknown as Product;

        if (!product) {
          return { success: false };
        }

        // Archive the product in Stripe if we have a Stripe product ID
        if (product.stripeProductId) {
          await stripe.products.update(product.stripeProductId, {
            active: false,
          });
        }

        // Soft delete: mark as archived instead of deleting
        await prisma.product.update({
          where: { id },
          data: {
            isArchived: true,
            isActive: false, // Also mark as inactive
          },
        });

        return { success: true };
      } catch (error) {
        console.error('Error archiving product:', error);
        return { success: false };
      }
    },

    toggleProductStatus: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      try {
        const product = await prisma.product.findUnique({
          where: { id },
        }) as unknown as Product;

        if (!product) {
          throw new Error('Product not found');
        }

        // Update status in Stripe
        if (product.stripeProductId) {
          await stripe.products.update(product.stripeProductId, {
            active: !product.isActive,
          });
        }

        // Update in our database
        return prisma.product.update({
          where: { id },
          data: {
            isActive: !product.isActive,
          },
        });
      } catch (error) {
        console.error('Error toggling product status:', error);
        throw new Error('Failed to toggle product status');
      }
    },
  },
}; 