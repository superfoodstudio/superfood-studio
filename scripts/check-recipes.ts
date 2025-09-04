#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkRecipes() {
  try {
    console.log('🔍 Checking recipe data for debugging...\n');
    
    // Get total count
    const totalCount = await prisma.recipe.count();
    console.log(`Total recipes: ${totalCount}`);
    
    const publishedCount = await prisma.recipe.count({
      where: { isPublished: true }
    });
    console.log(`Published recipes: ${publishedCount}`);
    
    // Get first 5 recipes with their slugs
    const sampleRecipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        ingredients: true,
        instructions: true
      },
      take: 5
    });
    
    console.log('\n📋 Sample recipes:');
    sampleRecipes.forEach((recipe, index) => {
      console.log(`  ${index + 1}. ${recipe.name}`);
      console.log(`     Slug: ${recipe.slug}`);
      console.log(`     Published: ${recipe.isPublished}`);
      console.log(`     Ingredients type: ${typeof recipe.ingredients}`);
      console.log(`     Instructions type: ${typeof recipe.instructions}`);
      console.log(`     URL: /recipes/${recipe.slug}`);
      console.log('');
    });
    
    // Check if any recipe has the specific structure we need
    const testRecipe = sampleRecipes[0];
    if (testRecipe) {
      console.log('🧪 Test recipe details:');
      console.log(`Name: ${testRecipe.name}`);
      console.log(`Slug: ${testRecipe.slug}`);
      console.log(`Ingredients preview: ${testRecipe.ingredients?.substring(0, 100)}...`);
      console.log(`Instructions preview: ${testRecipe.instructions?.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.error('❌ Error checking recipes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecipes();