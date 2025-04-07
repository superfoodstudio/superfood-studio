import { Prisma } from '@prisma/client';
import { GraphQLContext } from '../context';
import Stripe from 'stripe';

// Define our full Product type including Stripe fields
interface Product {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  videoUrl: string | null;
  price: number;
  category: string;
  tags: string[];
  inventory: number;
  isActive: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

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

interface UpdateProductInputWithStripe extends Prisma.ProductUpdateInput {
  stripeProductId?: string;
  stripePriceId?: string;
}

export const productResolvers = {
  Query: {
    products: async (_parent: unknown, args: ProductFilters, { prisma }: GraphQLContext) => {
      const { category, status, search, sort } = args;

      let orderBy: Prisma.ProductOrderByWithRelationInput = {};
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

      const where: Prisma.ProductWhereInput = {
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
  },

  Mutation: {
    createProduct: async (
      _parent: unknown,
      { input }: { input: CreateProductInputWithStripe },
      { prisma }: GraphQLContext
    ) => {
      try {
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

        // Now create the product in our database with Stripe IDs
        // Use a type cast to avoid TypeScript errors with the Prisma schema
        const productData: any = {
          name: input.name,
          description: input.description,
          photoUrl: input.photoUrl,
          videoUrl: input.videoUrl,
          price: input.price,
          category: input.category,
          tags: input.tags,
          inventory: input.inventory || 0,
          stripeProductId: stripeProduct.id,
          stripePriceId: stripePrice.id,
          isActive: true, // Set isActive to true by default for new products
        };

        return prisma.product.create({
          data: productData,
        });
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
            name: input.name as string || currentProduct.name,
            description: input.description as string || currentProduct.description,
            images: input.photoUrl ? [input.photoUrl as string] : undefined,
            active: input.isActive !== undefined ? input.isActive as boolean : currentProduct.isActive,
          });

          // If price is updated, create a new price in Stripe
          if (input.price !== undefined && input.price !== currentProduct.price) {
            const newPrice = await stripe.prices.create({
              product: currentProduct.stripeProductId,
              unit_amount: Math.round((input.price as number) * 100), // Convert to cents
              currency: 'usd',
            });

            // Add the new price ID to the input for database update
            input.stripePriceId = newPrice.id;
          }
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

        // Delete from our database
        await prisma.product.delete({
          where: { id },
        });

        return { success: true };
      } catch (error) {
        console.error('Error deleting product:', error);
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