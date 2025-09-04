#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function convertArrayToRichText(items: string[]): Promise<string> {
  if (!items || !Array.isArray(items)) {
    return '';
  }
  
  // Convert array items to a bulleted list in HTML
  const listItems = items.map(item => `<li>${item}</li>`).join('');
  return `<ul>${listItems}</ul>`;
}

async function convertInstructionsToRichText(items: string[]): Promise<string> {
  if (!items || !Array.isArray(items)) {
    return '';
  }
  
  // Convert array items to a numbered list in HTML
  const listItems = items.map(item => `<li>${item}</li>`).join('');
  return `<ol>${listItems}</ol>`;
}

async function migrateRecipesToRichText() {
  try {
    console.log('🔄 Starting recipe rich text migration...');
    
    // Fetch all recipes
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        name: true,
        ingredients: true,
        instructions: true,
      }
    });
    
    console.log(`Found ${recipes.length} recipes to migrate`);
    
    let migratedCount = 0;
    
    for (const recipe of recipes) {
      try {
        // Check if ingredients/instructions are arrays (need conversion)
        let needsUpdate = false;
        let newIngredients = recipe.ingredients;
        let newInstructions = recipe.instructions;
        
        // Handle ingredients
        if (Array.isArray(recipe.ingredients)) {
          newIngredients = await convertArrayToRichText(recipe.ingredients as any);
          needsUpdate = true;
        }
        
        // Handle instructions
        if (Array.isArray(recipe.instructions)) {
          newInstructions = await convertInstructionsToRichText(recipe.instructions as any);
          needsUpdate = true;
        }
        
        if (needsUpdate) {
          await prisma.recipe.update({
            where: { id: recipe.id },
            data: {
              ingredients: newIngredients,
              instructions: newInstructions,
            },
          });
          
          console.log(`✅ Migrated recipe: ${recipe.name}`);
          migratedCount++;
        } else {
          console.log(`⏭️  Skipped recipe (already rich text): ${recipe.name}`);
        }
        
      } catch (error) {
        console.error(`❌ Error migrating recipe ${recipe.name}:`, error);
      }
    }
    
    console.log(`🎉 Recipe migration completed! Updated ${migratedCount} recipes.`);
    
  } catch (error) {
    console.error('❌ Error during recipe migration:', error);
  }
}

async function migrateProductsToRichText() {
  try {
    console.log('🔄 Starting product rich text migration...');
    
    // Fetch all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      }
    });
    
    console.log(`Found ${products.length} products to check`);
    
    let migratedCount = 0;
    
    for (const product of products) {
      try {
        // Check if description needs HTML formatting
        if (product.description && typeof product.description === 'string') {
          // If it's plain text without HTML tags, wrap in paragraph
          if (!product.description.includes('<') && !product.description.includes('>')) {
            const richTextDescription = `<p>${product.description}</p>`;
            
            await prisma.product.update({
              where: { id: product.id },
              data: {
                description: richTextDescription,
              },
            });
            
            console.log(`✅ Migrated product: ${product.name}`);
            migratedCount++;
          } else {
            console.log(`⏭️  Skipped product (already rich text): ${product.name}`);
          }
        }
        
      } catch (error) {
        console.error(`❌ Error migrating product ${product.name}:`, error);
      }
    }
    
    console.log(`🎉 Product migration completed! Updated ${migratedCount} products.`);
    
  } catch (error) {
    console.error('❌ Error during product migration:', error);
  }
}

async function main() {
  try {
    console.log('🚀 Starting rich text migration script...\n');
    
    await migrateRecipesToRichText();
    console.log('');
    await migrateProductsToRichText();
    
    console.log('\n✨ All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();