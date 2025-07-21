#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupDatabase() {
  try {
    console.log('🧹 Starting database cleanup...');

    // Delete in correct order to respect foreign key constraints
    console.log('Deleting order items...');
    const deletedOrderItems = await prisma.orderItem.deleteMany({});
    console.log(`✅ Deleted ${deletedOrderItems.count} order items`);

    console.log('Deleting orders...');
    const deletedOrders = await prisma.order.deleteMany({});
    console.log(`✅ Deleted ${deletedOrders.count} orders`);

    console.log('Deleting cart items...');
    const deletedCartItems = await prisma.cartItem.deleteMany({});
    console.log(`✅ Deleted ${deletedCartItems.count} cart items`);

    console.log('Deleting carts...');
    const deletedCarts = await prisma.cart.deleteMany({});
    console.log(`✅ Deleted ${deletedCarts.count} carts`);

    console.log('Deleting products...');
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`✅ Deleted ${deletedProducts.count} products`);

    console.log('🎉 Database cleanup completed successfully!');
    
    // Verify cleanup
    const remainingProducts = await prisma.product.count();
    const remainingOrders = await prisma.order.count();
    const remainingOrderItems = await prisma.orderItem.count();
    
    console.log('\n📊 Final count:');
    console.log(`Products: ${remainingProducts}`);
    console.log(`Orders: ${remainingOrders}`);
    console.log(`Order Items: ${remainingOrderItems}`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupDatabase();