#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testRecipeQuery() {
  try {
    console.log('🔍 Testing recipe query directly...\n');
    
    const slug = 'green-goddess-smoothie';
    console.log(`Looking for recipe with slug: "${slug}"`);
    
    // Test direct Prisma query (what the GraphQL resolver uses)
    const recipeBySlug = await prisma.recipe.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        description: true,
        ingredients: true,
        instructions: true,
        mediaUrl: true,
        previewImageUrl: true,
      }
    });
    
    if (recipeBySlug) {
      console.log('✅ Recipe found via Prisma:');
      console.log(`  ID: ${recipeBySlug.id}`);
      console.log(`  Name: ${recipeBySlug.name}`);
      console.log(`  Slug: ${recipeBySlug.slug}`);
      console.log(`  Published: ${recipeBySlug.isPublished}`);
      console.log(`  Description: ${recipeBySlug.description?.substring(0, 100)}...`);
      console.log(`  Has ingredients: ${!!recipeBySlug.ingredients}`);
      console.log(`  Has instructions: ${!!recipeBySlug.instructions}`);
      console.log(`  Media URL: ${recipeBySlug.mediaUrl}`);
      console.log(`  Preview Image: ${recipeBySlug.previewImageUrl}`);
    } else {
      console.log('❌ Recipe NOT found via Prisma');
    }
    
    // Test also by searching for any recipe with similar slug
    console.log('\n🔍 Searching for any recipes with "green" in slug...');
    const similarRecipes = await prisma.recipe.findMany({
      where: {
        slug: {
          contains: 'green'
        }
      },
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
      }
    });
    
    if (similarRecipes.length > 0) {
      console.log(`Found ${similarRecipes.length} recipes with "green" in slug:`);
      similarRecipes.forEach((recipe, index) => {
        console.log(`  ${index + 1}. "${recipe.name}" -> ${recipe.slug} (published: ${recipe.isPublished})`);
      });
    } else {
      console.log('No recipes found with "green" in slug');
    }
    
    // Test a GraphQL query simulation
    console.log('\n🧪 Testing what the GraphQL resolver would return...');
    const graphqlResult = await prisma.recipe.findUnique({
      where: { slug: 'green-goddess-smoothie' },
    });
    
    console.log('GraphQL resolver simulation result:', graphqlResult ? 'Found' : 'Not Found');
    if (graphqlResult) {
      console.log(`  Recipe ID: ${graphqlResult.id}`);
      console.log(`  Name: ${graphqlResult.name}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing recipe query:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRecipeQuery();