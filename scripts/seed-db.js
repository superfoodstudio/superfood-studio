#!/usr/bin/env node
/**
 * Database Seeding Script
 * 
 * This script populates the database with fake data for development and testing.
 * It generates products, recipes, users, and other entities with realistic values.
 * 
 * Run with: node scripts/seed-db.js
 */

const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

// Configuration
const NUM_PRODUCTS = 20;
const NUM_RECIPES = 15;
const NUM_USERS = 10;
const NUM_ORDERS = 15;

// Clean stable image URLs from Unsplash for consistent images
const FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=800',
  'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?q=80&w=800',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=800',
];

const BEAUTY_IMAGES = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800',
  'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800',
  'https://images.unsplash.com/photo-1596478264010-7421ef9ab4be?q=80&w=800',
];

const WELLNESS_IMAGES = [
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800',
  'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=800',
  'https://images.unsplash.com/photo-1616431575878-211264a2659a?q=80&w=800',
  'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=800',
];

// Helper function to get random image based on category
function getRandomImage(category) {
  switch (category.toLowerCase()) {
    case 'food':
      return FOOD_IMAGES[Math.floor(Math.random() * FOOD_IMAGES.length)];
    case 'beauty':
      return BEAUTY_IMAGES[Math.floor(Math.random() * BEAUTY_IMAGES.length)];
    case 'wellness':
      return WELLNESS_IMAGES[Math.floor(Math.random() * WELLNESS_IMAGES.length)];
    default:
      const allImages = [...FOOD_IMAGES, ...BEAUTY_IMAGES, ...WELLNESS_IMAGES];
      return allImages[Math.floor(Math.random() * allImages.length)];
  }
}

// Helper function to get random array element
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate slug
function generateSlug(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')     // Replace & with 'and'
    .replace(/[^\w\-]+/g, '')   // Remove all non-word characters
    .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')         // Trim - from start of text
    .replace(/-+$/, '');        // Trim - from end of text
}

// Create users with different roles
async function createUsers() {
  console.log('🧑‍🤝‍🧑 Creating users...');
  
  const users = [];
  
  // Create an admin user
  users.push({
    email: 'admin@superfoodstudio.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    billingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: 'US',
    },
    shippingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: 'US',
    },
  });
  
  // Create regular users
  for (let i = 0; i < NUM_USERS - 1; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    users.push({
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      firstName,
      lastName,
      role: i < 3 ? 'SUBSCRIBER' : 'PUBLIC',
      billingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'US',
      },
      shippingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        country: 'US',
      },
    });
  }
  
  // Bulk create users
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user
    });
  }
  
  return await prisma.user.findMany();
}

// Create products in different categories
async function createProducts() {
  console.log('🛍️ Creating products...');
  
  const categories = ['food', 'beauty', 'wellness'];
  const products = [];
  
  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const category = getRandomElement(categories);
    // Make names unique by adding a timestamp and index
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.product()} ${Date.now()}-${i}`;
    const slug = generateSlug(name);
    
    products.push({
      name,
      slug,
      description: faker.commerce.productDescription(),
      photoUrl: getRandomImage(category),
      videoUrl: i % 5 === 0 ? 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' : null,
      price: parseFloat(faker.commerce.price({ min: 9.99, max: 99.99 })),
      category,
      tags: Array(3).fill(null).map(() => faker.commerce.productMaterial()),
      inventory: faker.number.int({ min: 0, max: 100 }),
      isActive: true,
      stripeProductId: `prod_${faker.string.alphanumeric(14)}`,
      stripePriceId: `price_${faker.string.alphanumeric(14)}`,
    });
  }
  
  // Bulk create products
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
  }
  
  return await prisma.product.findMany();
}

// Create recipes in different categories
async function createRecipes() {
  console.log('🍲 Creating recipes...');
  
  const categories = ['food', 'drink', 'dessert'];
  const recipes = [];
  
  for (let i = 0; i < NUM_RECIPES; i++) {
    const category = getRandomElement(categories);
    const name = `${faker.color.human()} ${faker.animal.type()} Dish`;
    const slug = generateSlug(name);
    
    // Generate 3-6 ingredients
    const ingredientCount = faker.number.int({ min: 3, max: 6 });
    const ingredients = Array(ingredientCount).fill(null).map(() => {
      const quantity = faker.number.int({ min: 1, max: 5 });
      const unit = getRandomElement(['tablespoon', 'teaspoon', 'cup', 'gram', 'ounce', 'pound', 'mole', 'joule', 'ampere', 'kelvin', 'candela', 'volt']);
      const ingredient = faker.commerce.productName();
      return `${quantity} ${unit} ${ingredient}`;
    });
    
    // Generate 3-6 instructions
    const instructionCount = faker.number.int({ min: 3, max: 6 });
    const instructions = Array(instructionCount).fill(null).map((_, index) => {
      return `Step ${index + 1}: ${faker.lorem.sentence()}`;
    });
    
    recipes.push({
      name,
      slug,
      description: faker.lorem.paragraph(),
      category,
      isPublished: Math.random() > 0.1, // 90% published
      mediaUrl: getRandomImage('food'),
      uploadDate: faker.date.past(),
      ingredients,
      instructions,
    });
  }
  
  // Bulk create recipes
  for (const recipe of recipes) {
    await prisma.recipe.create({
      data: recipe
    });
  }
  
  return await prisma.recipe.findMany();
}

// Create subscriptions for some users
async function createSubscriptions(users) {
  console.log('🔄 Creating subscriptions...');
  
  const subscriberUsers = users.filter(user => user.role === 'SUBSCRIBER' || user.role === 'ADMIN');
  
  for (const user of subscriberUsers) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        status: getRandomElement([
          'ACTIVE',
          'ACTIVE', // Use ACTIVE twice instead of PENDING 
          'CANCELED',
          'EXPIRED'
        ]),
        plan: getRandomElement(['MONTHLY', 'YEARLY']),
        startDate: faker.date.past(),
        endDate: faker.date.future(),
        stripeSubscriptionId: `sub_${faker.string.alphanumeric(14)}`,
        stripePriceId: `price_${faker.string.alphanumeric(14)}`,
      }
    });
  }
  
  return await prisma.subscription.findMany();
}

// Create carts for users
async function createCarts(users, products) {
  console.log('🛒 Creating carts...');
  
  const createdCarts = [];
  
  for (const user of users) {
    // 70% chance to have a cart
    if (faker.datatype.boolean(0.7)) {
      const cart = await prisma.cart.create({
        data: {
          userId: user.id,
        }
      });
      
      createdCarts.push(cart);
      
      // Add 1-5 items to the cart
      const numItems = faker.number.int({ min: 1, max: 5 });
      const selectedProducts = faker.helpers.arrayElements(products, numItems);
      
      for (const product of selectedProducts) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 3 }),
            price: product.price,
          }
        });
      }
    }
  }
  
  return await prisma.cart.findMany({
    include: {
      items: true
    }
  });
}

// Create orders with items
async function createOrders(users, products) {
  console.log('📦 Creating orders...');
  
  const orders = [];
  
  for (let i = 0; i < NUM_ORDERS; i++) {
    const user = getRandomElement(users);
    const numItems = faker.number.int({ min: 1, max: 5 });
    const selectedProducts = faker.helpers.arrayElements(products, numItems);
    
    const orderItems = selectedProducts.map(product => ({
      productId: product.id,
      quantity: faker.number.int({ min: 1, max: 3 }),
      price: product.price,
    }));
    
    const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: getRandomElement([
          'PENDING',
          'PROCESSING',
          'DELIVERED',
          'CANCELED'
        ]),
        total,
        items: {
          create: orderItems
        }
      }
    });
    
    orders.push(order);
  }
  
  return await prisma.order.findMany({
    include: {
      items: true
    }
  });
}

// Main seeding function
async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.subscription.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.recipe.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Create entities
    const users = await createUsers();
    const products = await createProducts();
    const recipes = await createRecipes();
    const subscriptions = await createSubscriptions(users);
    const carts = await createCarts(users, products);
    const orders = await createOrders(users, products);
    
    console.log('✅ Seeding completed successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${products.length} products`);
    console.log(`Created ${recipes.length} recipes`);
    console.log(`Created ${subscriptions.length} subscriptions`);
    console.log(`Created ${carts.length} carts`);
    console.log(`Created ${orders.length} orders`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seed(); 