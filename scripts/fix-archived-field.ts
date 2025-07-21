#!/usr/bin/env npx tsx

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixArchivedField() {
  try {
    console.log('🔧 Fixing isArchived field for existing products...');

    // Update all products to set isArchived to false (since the field was added after products were created)
    const result = await prisma.product.updateMany({
      data: {
        isArchived: false
      }
    });

    console.log(`✅ Updated ${result.count} products with isArchived: false`);

    // Count total products
    const totalProducts = await prisma.product.count();
    const archivedProducts = await prisma.product.count({
      where: { isArchived: true }
    });
    const activeProducts = await prisma.product.count({
      where: { isArchived: false }
    });

    console.log('\n📊 Product Status:');
    console.log(`Total products: ${totalProducts}`);
    console.log(`Active products: ${activeProducts}`);
    console.log(`Archived products: ${archivedProducts}`);

  } catch (error) {
    console.error('❌ Error fixing archived field:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixArchivedField();