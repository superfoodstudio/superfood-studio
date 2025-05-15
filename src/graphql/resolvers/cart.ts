import { GraphQLContext } from '../context';
import { Prisma, PrismaClient, Product, Cart as PrismaCart, CartItem as PrismaCartItem } from '@prisma/client';

interface AddToCartInput {
  productId: string;
  quantity: number;
  guestId?: string;
}

interface GuestCartArgs {
  guestId?: string;
}

interface CartWithTotal extends PrismaCart {
  items: PrismaCartItem[];
  total: number;
}

// Calculate cart totals
async function calculateCartTotal(prisma: PrismaClient, cartId: string): Promise<number> {
  const cartItems = await prisma.cartItem.findMany({
    where: { cartId },
    include: { product: true },
  });
  
  const total = cartItems.reduce((sum: number, item: PrismaCartItem & { product: Product }) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  return total;
}

// Get cart with items and calculated total
async function getCartWithItems(prisma: PrismaClient, cartId: string): Promise<CartWithTotal | null> {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });
  
  if (!cart) return null;
  
  // Calculate total
  const total = cart.items.reduce((sum: number, item: PrismaCartItem & { product: Product }) => {
    return sum + (item.price * item.quantity);
  }, 0);
  
  return {
    ...cart,
    total,
  };
}

export const cartResolvers = {
  Query: {
    cart: async (_parent: unknown, args: GuestCartArgs, { prisma, user }: GraphQLContext): Promise<CartWithTotal | null> => {
      try {
        let cart;
        
        if (user.isAuthenticated && user.id) {
          // Find user's cart
          cart = await prisma.cart.findUnique({
            where: { userId: user.id },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          });
          
          // If no cart exists, create one
          if (!cart) {
            cart = await prisma.cart.create({
              data: {
                userId: user.id,
              },
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
              },
            });
          }
        } else {
          // Handle guest cart using a cookie-based ID or similar
          const guestId = args.guestId || 'guest-id'; // You'd implement actual guest ID handling
          
          // Find or create guest cart
          cart = await prisma.cart.findFirst({
            where: { guestId },
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
          });
          
          if (!cart) {
            cart = await prisma.cart.create({
              data: {
                guestId,
              },
              include: {
                items: {
                  include: {
                    product: true,
                  },
                },
              },
            });
          }
        }
        
        // Calculate total
        const total = cart.items.reduce((sum: number, item: PrismaCartItem & { product: Product }) => {
          return sum + (item.price * item.quantity);
        }, 0);
        
        return {
          ...cart,
          total,
        };
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw new Error('Failed to fetch cart');
      }
    },
  },
  
  Mutation: {
    addToCart: async (
      _parent: unknown,
      { input }: { input: AddToCartInput },
      { prisma, user }: GraphQLContext
    ): Promise<CartWithTotal | null> => {
      try {
        const { productId, quantity, guestId: inputGuestId } = input;
        
        // Verify product exists and has enough inventory
        const product = await prisma.product.findUnique({
          where: { id: productId },
        });
        
        if (!product) {
          throw new Error('Product not found');
        }
        
        if (!product.isActive) {
          throw new Error('Product is not available');
        }
        
        if (product.inventory < quantity) {
          throw new Error('Not enough inventory available');
        }
        
        let cart;
        
        if (user.isAuthenticated && user.id) {
          // Find or create user's cart
          cart = await prisma.cart.findUnique({
            where: { userId: user.id },
          });
          
          if (!cart) {
            cart = await prisma.cart.create({
              data: {
                userId: user.id,
              },
            });
          }
        } else {
          // Handle guest cart using provided ID
          const guestId = inputGuestId || 'guest-id'; // You'd implement actual guest ID handling
          
          cart = await prisma.cart.findFirst({
            where: { guestId },
          });
          
          if (!cart) {
            cart = await prisma.cart.create({
              data: {
                guestId,
              },
            });
          }
        }
        
        // Check if item already exists in cart
        const existingCartItem = await prisma.cartItem.findFirst({
          where: {
            cartId: cart.id,
            productId,
          },
        });
        
        if (existingCartItem) {
          // Update quantity
          await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: {
              quantity: existingCartItem.quantity + quantity,
              price: product.price, // Update price in case it changed
            },
          });
        } else {
          // Add new item
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
              quantity,
              price: product.price,
            },
          });
        }
        
        // Return updated cart with items
        return getCartWithItems(prisma, cart.id);
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw new Error('Failed to add item to cart');
      }
    },
    
    removeFromCart: async (
      _parent: unknown,
      { cartItemId }: { cartItemId: string },
      { prisma, user }: GraphQLContext
    ): Promise<CartWithTotal | null> => {
      try {
        // Get the cart item to verify ownership
        const cartItem = await prisma.cartItem.findUnique({
          where: { id: cartItemId },
          include: { cart: true },
        });
        
        if (!cartItem) {
          throw new Error('Cart item not found');
        }
        
        // Verify ownership if authenticated
        if (user.isAuthenticated && user.id) {
          const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
          });
          
          if (!cart || cart.id !== cartItem.cartId) {
            throw new Error('Unauthorized to remove this item');
          }
        } else {
          // For guest carts, you'd need to verify based on the guest ID
          // This would be implemented based on your guest cart tracking approach
        }
        
        // Remove the item
        await prisma.cartItem.delete({
          where: { id: cartItemId },
        });
        
        // Return updated cart
        return getCartWithItems(prisma, cartItem.cartId);
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw new Error('Failed to remove item from cart');
      }
    },
    
    updateCartItem: async (
      _parent: unknown,
      { cartItemId, quantity }: { cartItemId: string; quantity: number },
      { prisma, user }: GraphQLContext
    ): Promise<CartWithTotal | null> => {
      try {
        if (quantity <= 0) {
          throw new Error('Quantity must be greater than zero');
        }
        
        // Get the cart item to verify ownership
        const cartItem = await prisma.cartItem.findUnique({
          where: { id: cartItemId },
          include: { cart: true, product: true },
        });
        
        if (!cartItem) {
          throw new Error('Cart item not found');
        }
        
        // Verify ownership if authenticated
        if (user.isAuthenticated && user.id) {
          const cart = await prisma.cart.findUnique({
            where: { userId: user.id },
          });
          
          if (!cart || cart.id !== cartItem.cartId) {
            throw new Error('Unauthorized to update this item');
          }
        }
        
        // Verify inventory
        if (cartItem.product.inventory < quantity) {
          throw new Error('Not enough inventory available');
        }
        
        // Update the quantity
        await prisma.cartItem.update({
          where: { id: cartItemId },
          data: { quantity },
        });
        
        // Return updated cart
        return getCartWithItems(prisma, cartItem.cartId);
      } catch (error) {
        console.error('Error updating cart item:', error);
        throw new Error('Failed to update cart item');
      }
    },
    
    clearCart: async (
      _parent: unknown,
      args: GuestCartArgs,
      { prisma, user }: GraphQLContext
    ): Promise<CartWithTotal | null> => {
      try {
        let cart;
        
        if (user.isAuthenticated && user.id) {
          cart = await prisma.cart.findUnique({
            where: { userId: user.id },
          });
        } else {
          // For guest carts
          const guestId = args.guestId || 'guest-id';
          cart = await prisma.cart.findFirst({
            where: { guestId },
          });
        }
        
        if (!cart) {
          throw new Error('Cart not found');
        }
        
        // Delete all items in the cart
        await prisma.cartItem.deleteMany({
          where: { cartId: cart.id },
        });
        
        // Return empty cart
        return {
          ...cart,
          items: [],
          total: 0,
        };
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw new Error('Failed to clear cart');
      }
    },
  },
}; 