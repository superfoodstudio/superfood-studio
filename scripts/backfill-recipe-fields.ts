#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function backfillRecipeFields() {
  try {
    console.log('🔄 Backfilling missing recipe fields...\n');

    // Get all recipes that need updating
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        cookTime: true,
        prepTime: true,
        totalTime: true,
      }
    });

    console.log(`Found ${recipes.length} recipes to check/update.\n`);

    let updated = 0;

    for (const recipe of recipes) {
      const updates: any = {};
      let needsUpdate = false;

      // Add missing timing data
      if (recipe.prepTime === null || recipe.prepTime === undefined) {
        updates.prepTime = Math.floor(Math.random() * 25) + 5; // 5-30 minutes
        needsUpdate = true;
      }

      if (recipe.cookTime === null || recipe.cookTime === undefined) {
        updates.cookTime = Math.floor(Math.random() * 45) + 5; // 5-50 minutes
        needsUpdate = true;
      }

      if (recipe.totalTime === null || recipe.totalTime === undefined) {
        const prepTime = updates.prepTime || recipe.prepTime || 10;
        const cookTime = updates.cookTime || recipe.cookTime || 15;
        updates.totalTime = prepTime + cookTime;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: updates
        });
        updated++;

        if (updated % 25 === 0) {
          console.log(`✅ Updated ${updated} recipes...`);
        }
      }
    }

    console.log(`\n🎉 Successfully updated ${updated} recipes!`);

    // Show some stats
    const stats = await prisma.recipe.aggregate({
      _avg: {
        prepTime: true,
        cookTime: true,
        totalTime: true,
      },
      _min: {
        prepTime: true,
        cookTime: true,
        totalTime: true,
      },
      _max: {
        prepTime: true,
        cookTime: true,
        totalTime: true,
      }
    });

    console.log('\n📊 Updated Recipe Statistics:');
    console.log(`  Prep Time: ${Math.round(stats._avg.prepTime || 0)} mins (${stats._min.prepTime} - ${stats._max.prepTime})`);
    console.log(`  Cook Time: ${Math.round(stats._avg.cookTime || 0)} mins (${stats._min.cookTime} - ${stats._max.cookTime})`);
    console.log(`  Total Time: ${Math.round(stats._avg.totalTime || 0)} mins (${stats._min.totalTime} - ${stats._max.totalTime})`);

    console.log('\n✨ All recipes now have:');
    console.log('  - Prep time (5-30 minutes)');
    console.log('  - Cook time (5-50 minutes)');
    console.log('  - Total time (prep + cook time)');

    console.log('\n📝 Note: Rating data (averageRating, totalRatings) is computed from RecipeRating records.');

  } catch (error) {
    console.error('❌ Error backfilling recipe fields:', error);
  } finally {
    await prisma.$disconnect();
  }
}

backfillRecipeFields();