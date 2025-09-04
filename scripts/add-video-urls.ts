#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// Sample cooking/recipe videos from Pexels and similar sources
const dummyVideoUrls = [
  'https://videos.pexels.com/video-files/3195394/3195394-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4252820/4252820-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4499100/4499100-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3298599/3298599-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/5338410/5338410-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4252820/4252820-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/3298435/3298435-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4499063/4499063-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/5217706/5217706-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3298725/3298725-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4499087/4499087-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3209762/3209762-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/5217660/5217660-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4499088/4499088-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3195307/3195307-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4252851/4252851-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/5338374/5338374-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3209743/3209743-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4499119/4499119-uhd_2560_1440_25fps.mp4',
];

async function updateRecipesWithVideos() {
  try {
    console.log('🎬 Adding dummy video URLs to all recipes...\n');
    
    // Get all recipes
    const recipes = await prisma.recipe.findMany({
      select: { id: true, name: true }
    });
    
    console.log(`Found ${recipes.length} recipes to update`);
    
    let updatedCount = 0;
    
    for (const recipe of recipes) {
      try {
        // Assign a random video URL
        const randomVideoUrl = dummyVideoUrls[Math.floor(Math.random() * dummyVideoUrls.length)];
        
        await prisma.recipe.update({
          where: { id: recipe.id },
          data: { mediaUrl: randomVideoUrl },
        });
        
        updatedCount++;
        
        if (updatedCount % 25 === 0) {
          console.log(`✅ Updated ${updatedCount} recipes...`);
        }
        
      } catch (error) {
        console.error(`❌ Error updating recipe ${recipe.name}:`, error);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} recipes with video URLs!`);
    
    // Show sample of updated recipes
    const sampleRecipes = await prisma.recipe.findMany({
      select: { name: true, mediaUrl: true },
      take: 5
    });
    
    console.log('\n📹 Sample updated recipes:');
    sampleRecipes.forEach((recipe, index) => {
      console.log(`  ${index + 1}. ${recipe.name}`);
      console.log(`     Video: ${recipe.mediaUrl}`);
    });
    
    console.log('\n✨ All recipes now have realistic cooking videos!');
    
  } catch (error) {
    console.error('❌ Error updating recipes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRecipesWithVideos();