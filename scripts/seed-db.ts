#!/usr/bin/env ts-node
/**
 * Database Seeding Script
 * 
 * This script populates the database with fake data for development and testing.
 * It generates products, recipes, users, and other entities with realistic values.
 * 
 * Run with: npx ts-node scripts/seed-db.ts
 */

import { PrismaClient, Role, OrderStatus, SubscriptionStatus, Plan } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Stripe from 'stripe';

const prisma = new PrismaClient();

// Initialize Stripe client if key is available
const stripe = process.env.STRIPE_SECRET_KEY ? 
  new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-03-31.basil' as Stripe.LatestApiVersion }) : null;

const isTestEnvironment = !stripe || process.env.NODE_ENV === 'test';

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

// Define types that match what Prisma returns
interface PrismaUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PrismaProduct {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  videoUrl: string | null;
  price: number;
  category: string;
  tags: string[];
  inventory: number;
  isActive: boolean;
  stripeProductId: string | null;
  stripePriceId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to get random image based on category
function getRandomImage(category: string): string {
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
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Helper function to generate slug
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
    role: Role.ADMIN,
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
      role: i < 3 ? Role.SUBSCRIBER : Role.PUBLIC,
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

// Create products in different categories with Stripe integration
async function createProducts() {
  console.log('🛍️ Creating products...');
  
  const categories = ['food', 'beauty', 'wellness'];
  
  for (let i = 0; i < NUM_PRODUCTS; i++) {
    const category = getRandomElement(categories);
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.product()}`;
    const slug = generateSlug(name);
    const description = faker.commerce.productDescription();
    const photoUrl = getRandomImage(category);
    const price = parseFloat(faker.commerce.price({ min: 9.99, max: 99.99 }));
    
    let stripeProductId = '';
    let stripePriceId = '';
    
    // Create product in Stripe if available
    if (stripe && !isTestEnvironment) {
      try {
        const stripeProduct = await stripe.products.create({
          name,
          description,
          images: [photoUrl],
          metadata: {
            category,
          },
        });
        
        const stripePrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.round(price * 100), // Convert to cents
          currency: 'usd',
        });
        
        stripeProductId = stripeProduct.id;
        stripePriceId = stripePrice.id;
      } catch (error) {
        console.error('Error creating product in Stripe:', error);
      }
    }
    
    // Create product in database
    await prisma.product.upsert({
      where: { name },
      update: {
        slug,
        description,
        photoUrl,
        price,
        category,
        tags: Array(Math.floor(Math.random() * 5) + 1)
          .fill(0)
          .map(() => faker.commerce.productAdjective()),
        inventory: Math.floor(Math.random() * 100) + 1,
        isActive: Math.random() > 0.1, // 90% active
        stripeProductId: stripeProductId || null,
        stripePriceId: stripePriceId || null,
      },
      create: {
        name,
        slug,
        description,
        photoUrl,
        price,
        category,
        tags: Array(Math.floor(Math.random() * 5) + 1)
          .fill(0)
          .map(() => faker.commerce.productAdjective()),
        inventory: Math.floor(Math.random() * 100) + 1,
        isActive: Math.random() > 0.1, // 90% active
        stripeProductId: stripeProductId || null,
        stripePriceId: stripePriceId || null,
      },
    });
  }
  
  return await prisma.product.findMany();
}

// Create recipes in different categories
async function createRecipes() {
  console.log('🥗 Creating recipes...');
  
  const categories = ['food', 'beauty', 'wellness'];
  
  for (let i = 0; i < NUM_RECIPES; i++) {
    const category = getRandomElement(categories);
    const name = `${faker.word.adjective()} ${faker.word.noun()}`;
    const slug = generateSlug(name);
    const description = faker.lorem.paragraph();
    const mediaUrl = getRandomImage(category);
    
    // Generate random ingredients (5-12 items)
    const ingredients = Array(Math.floor(Math.random() * 8) + 5)
      .fill(0)
      .map(() => `${faker.number.int({ min: 1, max: 4 })} ${faker.science.unit().name} ${faker.commerce.productName()}`);
    
    // Generate random instructions (3-7 steps)
    const instructions = Array(Math.floor(Math.random() * 5) + 3)
      .fill(0)
      .map((_, idx) => `Step ${idx + 1}: ${faker.lorem.sentence()}`);
    
    await prisma.recipe.upsert({
      where: { id: (i + 1).toString() }, // This won't actually match but keeps the upsert pattern
      update: {},
      create: {
        name,
        slug,
        description,
        category,
        isPublished: Math.random() > 0.2, // 80% published
        mediaUrl,
        ingredients,
        instructions,
        uploadDate: faker.date.recent({ days: 30 }),
      },
    });
  }
  
  return await prisma.recipe.findMany();
}

// Create subscriptions for some users
async function createSubscriptions(users: PrismaUser[]) {
  console.log('🔄 Creating subscriptions...');
  
  const subscriberUsers = users.filter(user => user.role === Role.SUBSCRIBER || user.role === Role.ADMIN);
  
  for (const user of subscriberUsers) {
    await prisma.subscription.create({
      data: {
        userId: user.id,
        status: getRandomElement([
          SubscriptionStatus.ACTIVE,
          SubscriptionStatus.ACTIVE, // Use ACTIVE twice instead of PENDING which isn't in the schema
          SubscriptionStatus.CANCELED,
          SubscriptionStatus.EXPIRED
        ]),
        plan: getRandomElement([Plan.MONTHLY, Plan.YEARLY]),
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
async function createCarts(users: PrismaUser[], products: PrismaProduct[]) {
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
async function createOrders(users: PrismaUser[], products: PrismaProduct[]) {
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
    
    const total = orderItems.reduce((sum: number, item: {price: number, quantity: number}) => 
      sum + (item.price * item.quantity), 0);
    
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: getRandomElement([
          OrderStatus.PENDING,
          OrderStatus.PROCESSING,
          OrderStatus.DELIVERED,
          OrderStatus.CANCELED
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