#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function cleanupRecipes() {
  try {
    console.log('🧹 Cleaning up existing recipes with array-based data...');
    
    // Delete recipe ratings first (foreign key constraint)
    console.log('Deleting recipe ratings...');
    const deletedRatings = await prisma.recipeRating.deleteMany({});
    console.log(`✅ Deleted ${deletedRatings.count} recipe ratings`);

    // Delete comments first (foreign key constraint)
    console.log('Deleting recipe comments...');
    const deletedComments = await prisma.comment.deleteMany({});
    console.log(`✅ Deleted ${deletedComments.count} recipe comments`);
    
    // Now delete all recipes
    console.log('Deleting all recipes...');
    const deletedRecipes = await prisma.recipe.deleteMany({});
    console.log(`✅ Deleted ${deletedRecipes.count} recipes`);
    
    console.log('');
    console.log('🎉 Recipe cleanup completed successfully!');
    console.log('');
    console.log('📝 Next steps:');
    console.log('  1. Use the admin panel to create new recipes');
    console.log('  2. New recipes will use rich text formatting for ingredients and instructions');
    console.log('  3. Content will render properly on recipe detail pages');
    
    // Verify cleanup
    const remainingRecipes = await prisma.recipe.count();
    const remainingComments = await prisma.comment.count();
    const remainingRatings = await prisma.recipeRating.count();
    
    console.log('');
    console.log('📊 Final count:');
    console.log(`  Recipes: ${remainingRecipes}`);
    console.log(`  Comments: ${remainingComments}`);
    console.log(`  Ratings: ${remainingRatings}`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupRecipes();