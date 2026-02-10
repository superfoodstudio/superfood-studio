import { PrismaClient } from '@prisma/client';
import { GraphQLContext } from '../context';
import Stripe from 'stripe';
import { generateSlug } from '@/lib/utils';
import { requireActiveSubscription } from './helpers';

async function requireAdmin(context: GraphQLContext) {
  const user = await context.getFullUser();
  if (!user?.isAuthenticated || user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
}

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
        orderBy: { createdAt: 'desc' },
        take: 50
      });
    },

    // Resolver for the averageRating field (uses aggregate instead of fetching all rows)
    averageRating: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      const result = await prisma.productRating.aggregate({
        where: { productId: parent.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      if (result._count.rating === 0) {
        return null;
      }

      return result._avg.rating ? Number(result._avg.rating.toFixed(1)) : null;
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
        take: 100,
      });
    },

    product: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      return prisma.product.findUnique({
        where: { id },
      });
    },
    
    productBySlug: async (_parent: unknown, { slug }: { slug: string }, context: GraphQLContext) => {
      const { prisma } = context;
      const fullUser = await context.getFullUser();
      if (!fullUser?.isAuthenticated) {
        throw new Error('Authentication required to view products');
      }
      if (fullUser.role !== 'ADMIN') {
        await requireActiveSubscription(prisma, fullUser.id!);
      }
      const product = await prisma.product.findUnique({
        where: { slug },
      });
      if (product && (product as any).isArchived) {
        return null;
      }
      return product;
    },
    
    productsByCategory: async (_parent: unknown, args: PublicProductFilters, { prisma }: GraphQLContext) => {
      const { category } = args;
      const limit = Math.min(Math.max(args.limit || 20, 1), 100);
      const offset = Math.max(args.offset || 0, 0);
      
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
      { first, after, category, status, search, sort }: {
        first?: number;
        after?: string;
        category?: string;
        status?: string;
        search?: string;
        sort?: string;
      },
      context: GraphQLContext
    ) => {
      const { prisma } = context;
      const fullUser = await context.getFullUser();
      if (!fullUser?.isAuthenticated) {
        throw new Error('Authentication required to view products');
      }
      if (fullUser.role !== 'ADMIN') {
        await requireActiveSubscription(prisma, fullUser.id!);
      }
      const { paginateQuery } = await import('@/lib/pagination');
      
      const baseWhere: any = {
        isArchived: false,
        ...(category ? { category } : {}),
        ...(status && status !== 'all' ? { isActive: status === 'active' } : {}),
        ...(search ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
      };

      // Determine cursor field and sort order based on sort parameter
      let cursorField = 'createdAt';
      let sortOrder: 'asc' | 'desc' = 'desc';

      switch (sort) {
        case 'a-z':
          cursorField = 'name';
          sortOrder = 'asc';
          break;
        case 'z-a':
          cursorField = 'name';
          sortOrder = 'desc';
          break;
        case 'price-low-high':
          cursorField = 'price';
          sortOrder = 'asc';
          break;
        case 'price-high-low':
          cursorField = 'price';
          sortOrder = 'desc';
          break;
        case 'oldest':
          cursorField = 'createdAt';
          sortOrder = 'asc';
          break;
        case 'newest':
        default:
          cursorField = 'createdAt';
          sortOrder = 'desc';
          break;
      }

      return paginateQuery(
        prisma.product,
        { first, after },
        baseWhere,
        {
          cursorField,
          sortOrder,
          defaultLimit: 12,
          maxLimit: 50
        }
      );
    },

    productCategories: async (_parent: unknown, _args: unknown, { prisma }: GraphQLContext) => {
      const categories = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
        where: {
          category: {
            not: ''
          },
          isArchived: false
        }
      });

      return categories
        .map(p => p.category)
        .filter(Boolean)
        .sort();
    },

    featuredProduct: async (_parent: unknown, _args: unknown, { prisma }: GraphQLContext) => {
      return prisma.product.findFirst({
        where: { isFeatured: true, isActive: true, isArchived: false },
      });
    },
  },

  Mutation: {
    rateProduct: async (
      _parent: unknown,
      { input }: { input: { productId: string; rating: number } },
      { prisma, user }: GraphQLContext
    ) => {
      const { productId, rating } = input;
      if (!user || !user.id) {
        throw new Error('Authentication required');
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Check if rating exists, then create or update (avoiding transactions)
      let productRating = await prisma.productRating.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId
          }
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

      if (productRating) {
        // Update existing rating
        productRating = await prisma.productRating.update({
          where: {
            userId_productId: {
              userId: user.id,
              productId: productId
            }
          },
          data: {
            rating: rating,
            updatedAt: new Date()
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
      } else {
        // Create new rating
        productRating = await prisma.productRating.create({
          data: {
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
      }

      return productRating;
    },

    createProduct: async (
      _parent: unknown,
      { input }: { input: CreateProductInputWithStripe },
      context: GraphQLContext
    ) => {
      const user = await requireAdmin(context);
      const { prisma } = context;

      // Input validation
      if (!input.name?.trim()) throw new Error('Product name is required');
      if (input.price <= 0) throw new Error('Price must be greater than zero');
      if (input.inventory !== undefined && input.inventory < 0) throw new Error('Inventory cannot be negative');

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
        console.error(error);
        throw new Error('Failed to create product with Stripe');
      }
    },

    updateProduct: async (
      _parent: unknown,
      { id, input }: { id: string; input: UpdateProductInputWithStripe },
      context: GraphQLContext
    ) => {
      await requireAdmin(context);
      const { prisma } = context;

      // Input validation
      if (input.price !== undefined && input.price <= 0) throw new Error('Price must be greater than zero');
      if (input.inventory !== undefined && input.inventory < 0) throw new Error('Inventory cannot be negative');

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
        console.error(error);
        throw new Error('Failed to update product with Stripe');
      }
    },

    deleteProduct: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      const { prisma } = context;
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
        console.error(error);
        return { success: false };
      }
    },

    toggleProductStatus: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      const { prisma } = context;
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
        console.error(error);
        throw new Error('Failed to toggle product status');
      }
    },

    setFeaturedProduct: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      const { prisma } = context;
      return prisma.$transaction(async (tx) => {
        await tx.product.updateMany({
          where: { isFeatured: true },
          data: { isFeatured: false },
        });
        return tx.product.update({
          where: { id },
          data: { isFeatured: true },
        });
      });
    },
  },
}; 