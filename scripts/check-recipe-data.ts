#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkData() {
  try {
    // Check sample recipe data
    const sampleRecipe = await prisma.recipe.findFirst({
      select: {
        id: true,
        name: true,
        prepTime: true,
        cookTime: true,
        totalTime: true,
        isFeatured: true
      }
    });
    console.log('Sample recipe data:', JSON.stringify(sampleRecipe, null, 2));

    // Check if we have any featured recipes
    const featuredRecipe = await prisma.recipe.findFirst({
      where: { isFeatured: true },
      select: {
        id: true,
        name: true,
        prepTime: true,
        cookTime: true,
        totalTime: true,
        isFeatured: true
      }
    });
    console.log('Featured recipe:', JSON.stringify(featuredRecipe, null, 2));

    // Check how many recipes have timing data
    const recipesWithTiming = await prisma.recipe.count({
      where: {
        AND: [
          { prepTime: { not: null } },
          { cookTime: { not: null } },
          { totalTime: { not: null } }
        ]
      }
    });
    console.log(`Recipes with full timing data: ${recipesWithTiming}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();