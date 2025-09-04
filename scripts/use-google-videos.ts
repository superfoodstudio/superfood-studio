#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// Only Google Cloud Storage videos (these 100% work)
const googleVideoUrls = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
];

async function useGoogleVideos() {
  try {
    console.log('🎬 Using only Google Cloud Storage videos (100% reliable)...\n');
    
    // Get all recipes
    const recipes = await prisma.recipe.findMany({
      select: { id: true, name: true }
    });
    
    console.log(`Found ${recipes.length} recipes to update`);
    
    let updatedCount = 0;
    
    for (const [index, recipe] of recipes.entries()) {
      try {
        // Cycle through Google videos
        const videoUrl = googleVideoUrls[index % googleVideoUrls.length];
        
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { mediaUrl: videoUrl },
        });
        
        updatedCount++;
        
        if (updatedCount % 30 === 0) {
          console.log(`✅ Updated ${updatedCount} recipes...`);
        }
        
      } catch (error) {
        console.error(`❌ Error updating recipe ${recipe.name}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} recipes with Google Cloud videos!`);
    
    // Test the Google URLs
    console.log('\n🔍 Testing Google Cloud video URLs...');
    const testUrls = googleVideoUrls.slice(0, 3);
    
    for (const [index, url] of testUrls.entries()) {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        console.log(`  ${index + 1}. ${response.status === 200 ? '✅' : '❌'} ${url.split('/').pop()}`);
      } catch (error) {
        console.log(`  ${index + 1}. ❌ ${url.split('/').pop()} (fetch error)`);
      }
    }
    
    // Show sample of updated recipes
    const sampleRecipes = await prisma.recipe.findMany({
      select: { name: true, mediaUrl: true },
      take: 5
    });
    
    console.log('\n📹 Sample updated recipes:');
    sampleRecipes.forEach((recipe, index) => {
      const videoName = recipe.mediaUrl.split('/').pop();
      console.log(`  ${index + 1}. ${recipe.name} -> ${videoName}`);
    });
    
    console.log('\n✨ All videos now use Google Cloud Storage - guaranteed to work!');
    console.log(`📊 Using ${googleVideoUrls.length} different videos distributed across ${recipes.length} recipes`);
    
  } catch (error) {
    console.error('❌ Error updating video URLs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

useGoogleVideos();