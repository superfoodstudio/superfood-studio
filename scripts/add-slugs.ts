#!/usr/bin/env ts-node
/**
 * Add Slugs Script
 * 
 * This script updates existing products and recipes in the database
 * to add a unique slug field based on their names.
 * 
 * Run with: npx ts-node scripts/add-slugs.ts
 */

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// Slug generation function
function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')     // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '')         // Trim - from end of text
    .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
}

async function ensureUnique(collection: any, slug: string, idToExclude: any = null): Promise<string> {
  let uniqueSlug = slug;
  let counter = 0;
  let exists = true;
  
  while (exists) {
    // Check if slug exists (excluding the current document)
    const query = idToExclude 
      ? { slug: uniqueSlug, _id: { $ne: idToExclude } }
      : { slug: uniqueSlug };
      
    const count = await collection.countDocuments(query);
    
    if (count === 0) {
      exists = false;
    } else {
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    }
  }
  
  return uniqueSlug;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  // Using MongoDB Client directly for bulk operations
  const mongoClient = new MongoClient(process.env.DATABASE_URL);
  
  try {
    console.log('🔄 Connecting to database...');
    await mongoClient.connect();
    
    const db = mongoClient.db('superfoodstudio');
    const productsCollection = db.collection('Product');
    const recipesCollection = db.collection('Recipe');
    
    // Update products
    console.log('🛍️ Adding slugs to products...');
    const products = await productsCollection.find({}).toArray();
    
    for (const product of products) {
      const baseSlug = generateSlug(product.name || `product-${product._id}`);
      const uniqueSlug = await ensureUnique(productsCollection, baseSlug, product._id);
      
      await productsCollection.updateOne(
        { _id: product._id },
        { $set: { slug: uniqueSlug } }
      );
      
      console.log(`Updated product: ${product.name} → ${uniqueSlug}`);
    }
    
    // Update recipes
    console.log('🥗 Adding slugs to recipes...');
    const recipes = await recipesCollection.find({}).toArray();
    
    for (const recipe of recipes) {
      const baseSlug = generateSlug(recipe.name || `recipe-${recipe._id}`);
      const uniqueSlug = await ensureUnique(recipesCollection, baseSlug, recipe._id);
      
      await recipesCollection.updateOne(
        { _id: recipe._id },
        { $set: { slug: uniqueSlug } }
      );
      
      console.log(`Updated recipe: ${recipe.name} → ${uniqueSlug}`);
    }
    
    console.log('✅ All slugs added successfully!');
    
  } catch (error) {
    console.error('❌ Error updating slugs:', error);
  } finally {
    await mongoClient.close();
  }
}

// Run the main function
main()
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 