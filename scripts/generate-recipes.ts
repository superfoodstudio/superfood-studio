#!/usr/bin/env npx tsx

import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Load environment variables
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

// Recipe data arrays
const recipeNames = [
  // Smoothies & Drinks
  'Green Goddess Smoothie', 'Tropical Paradise Bowl', 'Chocolate Peanut Butter Smoothie',
  'Antioxidant Berry Blast', 'Golden Turmeric Latte', 'Matcha Energy Boost',
  'Vanilla Protein Smoothie', 'Detox Green Juice', 'Immunity Citrus Shot',
  'Coconut Lime Refresher', 'Blueberry Muffin Smoothie', 'Banana Bread Shake',
  
  // Breakfast
  'Overnight Chia Pudding', 'Superfood Granola Bowl', 'Avocado Toast Deluxe',
  'Quinoa Breakfast Bowl', 'Sweet Potato Pancakes', 'Acai Power Bowl',
  'Coconut Yogurt Parfait', 'Green Smoothie Bowl', 'Energy Breakfast Bites',
  'Spirulina Pancakes', 'Golden Milk Oatmeal', 'Protein Power Muffins',
  
  // Snacks
  'Raw Energy Balls', 'Superfood Trail Mix', 'Kale Chips Parmesan',
  'Almond Butter Cups', 'Coconut Date Balls', 'Cacao Nib Bars',
  'Dehydrated Fruit Leather', 'Seed Crackers', 'Veggie Hummus Wraps',
  'Roasted Chickpea Snacks', 'Nut-Free Energy Bites', 'Green Goddess Dip',
  
  // Lunch/Dinner
  'Rainbow Buddha Bowl', 'Quinoa Stuffed Peppers', 'Lentil Walnut Bolognese',
  'Cauliflower Rice Stir-fry', 'Mediterranean Zucchini Noodles', 'Black Bean Tacos',
  'Mushroom Meatballs', 'Roasted Vegetable Curry', 'Chickpea Salad Sandwich',
  'Sweet Potato Gnocchi', 'Zucchini Lasagna', 'Stuffed Portobello Mushrooms',
  
  // Desserts
  'Raw Chocolate Tart', 'Coconut Ice Cream', 'Chia Seed Pudding',
  'Avocado Chocolate Mousse', 'Date Caramel Sauce', 'Raw Cheesecake',
  'Superfood Brownies', 'Cashew Cream Pie', 'Banana Nice Cream',
  'Raw Cookie Dough Bites', 'Chocolate Chia Pudding', 'Coconut Macaroons',
  
  // Wellness Shots & Tonics
  'Ginger Turmeric Shot', 'Green Goddess Elixir', 'Immune Boost Tonic',
  'Liver Detox Juice', 'Energy Adapto-Smoothie', 'Anti-Inflammatory Tea',
  'Digestive Aid Smoothie', 'Stress Relief Latte', 'Beauty Collagen Drink',
  'Brain Boost Smoothie', 'Recovery Green Juice', 'Hormone Balance Smoothie',
];

const categories = ['smoothie', 'breakfast', 'snack', 'lunch', 'dinner', 'dessert', 'wellness'];

const superfoods = [
  'spirulina', 'chlorella', 'maca powder', 'cacao powder', 'chia seeds', 'hemp seeds',
  'goji berries', 'acai powder', 'matcha powder', 'turmeric', 'ashwagandha',
  'reishi mushroom', 'lions mane', 'cordyceps', 'collagen peptides', 'moringa',
  'wheatgrass', 'barley grass', 'bee pollen', 'royal jelly', 'coconut oil',
];

const baseIngredients = [
  'organic spinach', 'kale leaves', 'cucumber', 'celery', 'carrots', 'beets',
  'avocado', 'banana', 'berries', 'apple', 'pear', 'lemon', 'lime', 'ginger',
  'coconut milk', 'almond milk', 'oat milk', 'cashew milk', 'hemp milk',
  'quinoa', 'buckwheat', 'oats', 'brown rice', 'sweet potato', 'cauliflower',
  'broccoli', 'zucchini', 'bell peppers', 'tomatoes', 'onions', 'garlic',
  'almonds', 'walnuts', 'cashews', 'pecans', 'pumpkin seeds', 'sunflower seeds',
  'tahini', 'almond butter', 'coconut butter', 'olive oil', 'coconut flour',
  'almond flour', 'dates', 'maple syrup', 'honey', 'stevia', 'vanilla extract',
];

const cookingMethods = [
  'Blend until smooth', 'Mix gently until combined', 'Whisk until frothy',
  'Pulse in food processor', 'Stir with wooden spoon', 'Fold ingredients together',
  'Steam for 5-7 minutes', 'Sauté over medium heat', 'Roast at 375°F',
  'Bake until golden brown', 'Dehydrate for 4-6 hours', 'Chill for 2 hours',
  'Let sit overnight', 'Marinate for 30 minutes', 'Simmer until tender',
];

const measurements = ['1 cup', '2 cups', '1/2 cup', '1/4 cup', '1 tbsp', '2 tbsp', '1 tsp', '1/2 tsp', '1 handful', '2 handfuls'];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateIngredients(): string {
  const numIngredients = Math.floor(Math.random() * 8) + 4; // 4-12 ingredients
  const selectedSuperfoods = getRandomElements(superfoods, Math.floor(Math.random() * 3) + 1);
  const selectedBase = getRandomElements(baseIngredients, numIngredients - selectedSuperfoods.length);
  const allIngredients = [...selectedSuperfoods, ...selectedBase];
  
  const ingredientsList = allIngredients.map(ingredient => {
    const measurement = measurements[Math.floor(Math.random() * measurements.length)];
    return `<li>${measurement} ${ingredient}</li>`;
  });
  
  return `<ul>${ingredientsList.join('')}</ul>`;
}

function generateInstructions(): string {
  const steps = [
    'Wash and prepare all fresh ingredients thoroughly.',
    'Add liquid ingredients to your blender or mixing bowl first.',
    'Gradually add dry ingredients and superfoods.',
    ...getRandomElements(cookingMethods, Math.floor(Math.random() * 4) + 2),
    'Taste and adjust sweetness or seasoning as needed.',
    'Serve immediately or store in refrigerator for up to 3 days.',
    'Garnish with fresh herbs, seeds, or nuts if desired.',
  ];
  
  const selectedSteps = getRandomElements(steps, Math.floor(Math.random() * 4) + 4); // 4-8 steps
  const instructionsList = selectedSteps.map((step, index) => 
    `<li><strong>Step ${index + 1}:</strong> ${step}</li>`
  );
  
  return `<ol>${instructionsList.join('')}</ol>`;
}

function generateDescription(): string {
  const descriptions = [
    'A nutrient-dense superfood recipe packed with vitamins, minerals, and antioxidants.',
    'This energizing blend combines powerful superfoods with delicious natural flavors.',
    'A perfect balance of taste and nutrition, featuring organic whole food ingredients.',
    'Boost your energy and support your wellness with this easy-to-make superfood creation.',
    'Rich in plant-based protein and essential nutrients for optimal health and vitality.',
    'A vibrant, colorful dish that nourishes your body from the inside out.',
    'Combining traditional ingredients with modern superfoods for maximum nutritional benefit.',
    'Quick and easy to prepare, perfect for busy lifestyles without compromising nutrition.',
    'Anti-inflammatory ingredients come together in this delicious and healing recipe.',
    'Support your immune system and digestive health with this powerhouse combination.',
  ];
  
  const selectedDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
  return `<p>${selectedDesc}</p>`;
}

async function generateRecipes() {
  try {
    console.log('🌱 Generating 150 superfood recipes with rich text content...\n');
    
    const recipes = [];
    const usedSlugs = new Set<string>();
    
    for (let i = 0; i < 150; i++) {
      let recipeName;
      let slug;
      
      // Ensure unique names and slugs
      do {
        if (i < recipeNames.length) {
          recipeName = recipeNames[i];
        } else {
          // Generate additional names if we need more than our predefined list
          const baseName = recipeNames[Math.floor(Math.random() * recipeNames.length)];
          const modifier = ['Supreme', 'Deluxe', 'Ultimate', 'Power', 'Enhanced', 'Special'][Math.floor(Math.random() * 6)];
          recipeName = `${modifier} ${baseName} ${i - recipeNames.length + 1}`;
        }
        slug = slugify(recipeName);
      } while (usedSlugs.has(slug));
      
      usedSlugs.add(slug);
      
      const category = categories[Math.floor(Math.random() * categories.length)];
      const isPublished = Math.random() > 0.2; // 80% published
      
      const recipe = {
        name: recipeName,
        slug: slug,
        description: generateDescription(),
        category: category,
        isPublished: isPublished,
        ingredients: generateIngredients(),
        instructions: generateInstructions(),
        mediaUrl: `https://example.com/media/${slug}.mp3`, // Placeholder media URL
        previewImageUrl: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000) + 1500000000}?w=800&q=80`, // Random Unsplash-style URL
      };
      
      recipes.push(recipe);
      
      // Show progress
      if ((i + 1) % 25 === 0) {
        console.log(`✅ Generated ${i + 1} recipes...`);
      }
    }
    
    console.log('\n💾 Saving recipes to database...\n');
    
    // Insert all recipes
    const result = await prisma.recipe.createMany({
      data: recipes,
    });
    
    console.log(`🎉 Successfully created ${result.count} recipes!`);
    
    // Show some stats
    const totalRecipes = await prisma.recipe.count();
    const publishedRecipes = await prisma.recipe.count({ where: { isPublished: true } });
    const draftRecipes = totalRecipes - publishedRecipes;
    
    const categoryCounts = await Promise.all(
      categories.map(async (category) => ({
        category,
        count: await prisma.recipe.count({ where: { category } })
      }))
    );
    
    console.log('\n📊 Recipe Statistics:');
    console.log(`  Total: ${totalRecipes}`);
    console.log(`  Published: ${publishedRecipes}`);
    console.log(`  Drafts: ${draftRecipes}`);
    console.log('\n📂 By Category:');
    categoryCounts.forEach(({ category, count }) => {
      console.log(`  ${category}: ${count}`);
    });
    
    console.log('\n✨ All recipes now feature:');
    console.log('  - Rich text descriptions with HTML formatting');
    console.log('  - Structured ingredient lists with proper HTML');
    console.log('  - Step-by-step instructions with numbered lists');
    console.log('  - Realistic superfood combinations');
    console.log('  - Proper slug generation for URLs');
    
  } catch (error) {
    console.error('❌ Error generating recipes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateRecipes();