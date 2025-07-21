#!/usr/bin/env npx tsx

const GRAPHQL_ENDPOINT = 'http://localhost:3000/api/graphql';

// Realistic superfood products for the studio
const PRODUCTS = [
  {
    name: "Organic Spirulina Powder",
    description: "Premium blue-green algae superfood packed with protein, vitamins, and minerals. Perfect for smoothies, juices, and health bowls. Sustainably sourced and certified organic.",
    photoUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80",
    price: 29.99,
    category: "Powders",
    tags: ["organic", "protein", "vegan", "superfood", "algae"],
    inventory: 50
  },
  {
    name: "Raw Cacao Powder",
    description: "Unroasted, cold-pressed cacao powder with intense chocolate flavor and high antioxidant content. Rich in magnesium, iron, and mood-boosting compounds.",
    photoUrl: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80",
    price: 24.99,
    category: "Powders",
    tags: ["raw", "cacao", "antioxidants", "chocolate", "magnesium"],
    inventory: 35
  },
  {
    name: "Maca Root Powder",
    description: "Peruvian adaptogenic root known for energy and hormone balance. Nutty, malty flavor that's perfect for smoothies, coffee, and baking. Gelatinized for better digestion.",
    photoUrl: "https://images.unsplash.com/photo-1609501676725-7186f08b127b?w=800&q=80",
    price: 22.99,
    category: "Powders",
    tags: ["adaptogenic", "energy", "hormone", "peruvian", "maca"],
    inventory: 40
  },
  {
    name: "Chlorella Tablets",
    description: "Potent green algae superfood in convenient tablet form. Supports detoxification, immune function, and provides complete protein. 1000mg per tablet.",
    photoUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    price: 34.99,
    category: "Supplements",
    tags: ["chlorella", "detox", "immune", "protein", "tablets"],
    inventory: 25
  },
  {
    name: "Ashwagandha Extract",
    description: "Premium KSM-66 ashwagandha root extract. Clinically studied adaptogen for stress relief, energy, and cognitive function. 600mg per capsule.",
    photoUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80",
    price: 39.99,
    category: "Supplements",
    tags: ["ashwagandha", "adaptogen", "stress", "energy", "ksm66"],
    inventory: 30
  },
  {
    name: "Turmeric Golden Milk Blend",
    description: "Warming blend of organic turmeric, ginger, cinnamon, black pepper, and coconut milk powder. Anti-inflammatory and delicious. Just add hot water or milk.",
    photoUrl: "https://images.unsplash.com/photo-1609298692644-e5f99ce73a9d?w=800&q=80",
    price: 18.99,
    category: "Blends",
    tags: ["turmeric", "golden milk", "anti-inflammatory", "warming", "organic"],
    inventory: 45
  },
  {
    name: "Superfood Green Blend",
    description: "Comprehensive green superfood powder with spirulina, chlorella, wheatgrass, spinach, kale, and more. One scoop provides nutrients from 15+ organic greens.",
    photoUrl: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=800&q=80",
    price: 49.99,
    category: "Blends",
    tags: ["greens", "superfood", "comprehensive", "organic", "nutrition"],
    inventory: 20
  },
  {
    name: "Lion's Mane Mushroom Powder",
    description: "Organic lion's mane mushroom powder for cognitive support and brain health. Neuroprotective compounds may support memory, focus, and nerve regeneration.",
    photoUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
    price: 44.99,
    category: "Mushrooms",
    tags: ["lions mane", "cognitive", "brain health", "mushroom", "nootropic"],
    inventory: 15
  },
  {
    name: "Reishi Mushroom Extract",
    description: "Premium reishi mushroom extract powder. Known as the 'mushroom of immortality' for immune support, stress relief, and promoting restful sleep.",
    photoUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
    price: 52.99,
    category: "Mushrooms",
    tags: ["reishi", "immune", "sleep", "stress relief", "extract"],
    inventory: 12
  },
  {
    name: "Cordyceps Mushroom Capsules",
    description: "Wild-crafted cordyceps mushroom for energy, endurance, and respiratory support. Popular with athletes and active individuals. 500mg per capsule.",
    photoUrl: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&q=80",
    price: 48.99,
    category: "Mushrooms",
    tags: ["cordyceps", "energy", "endurance", "athletic", "respiratory"],
    inventory: 18
  },
  {
    name: "Collagen Peptides",
    description: "Grass-fed, pasture-raised collagen peptides for skin, hair, nails, and joint health. Unflavored powder that dissolves easily in any beverage.",
    photoUrl: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&q=80",
    price: 42.99,
    category: "Protein",
    tags: ["collagen", "grass-fed", "skin", "joints", "beauty"],
    inventory: 28
  },
  {
    name: "Plant-Based Protein Blend",
    description: "Complete protein blend of pea, hemp, and pumpkin seed proteins. 25g protein per serving with all essential amino acids. Vanilla flavor.",
    photoUrl: "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&q=80",
    price: 36.99,
    category: "Protein",
    tags: ["plant protein", "vegan", "complete protein", "vanilla", "amino acids"],
    inventory: 32
  }
];

async function createProduct(product: any) {
  const mutation = `
    mutation CreateProduct($input: CreateProductInput!) {
      createProduct(input: $input) {
        id
        name
        stripeProductId
        stripePriceId
        price
        category
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          input: product
        }
      })
    });

    const result = await response.json();
    
    if (result.errors) {
      console.error(`❌ Error creating ${product.name}:`, result.errors);
      return null;
    }

    return result.data.createProduct;
  } catch (error) {
    console.error(`❌ Network error creating ${product.name}:`, error);
    return null;
  }
}

async function createAllProducts() {
  console.log('🌱 Creating superfood products...');
  console.log(`📦 Will create ${PRODUCTS.length} products\n`);

  let successCount = 0;
  let failCount = 0;

  for (const product of PRODUCTS) {
    console.log(`Creating: ${product.name}...`);
    
    const result = await createProduct(product);
    
    if (result) {
      console.log(`✅ Created: ${result.name}`);
      console.log(`   💰 Price: $${result.price}`);
      console.log(`   🏷️  Category: ${result.category}`);
      console.log(`   🔗 Stripe Product: ${result.stripeProductId}`);
      console.log(`   💳 Stripe Price: ${result.stripePriceId}\n`);
      successCount++;
    } else {
      console.log(`❌ Failed to create: ${product.name}\n`);
      failCount++;
    }

    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('🎉 Product creation completed!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${successCount + failCount}`);
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' })
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🚀 Starting product creation script...\n');
  
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.error('❌ GraphQL server is not running at http://localhost:3000/api/graphql');
    console.log('💡 Please start your Next.js server with: npm run dev');
    process.exit(1);
  }

  console.log('✅ Server is running, proceeding with product creation...\n');
  await createAllProducts();
}

main();