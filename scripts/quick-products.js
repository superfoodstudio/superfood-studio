const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function main() {
  console.log('🛍️ Creating products with UUID names...');
  
  const categories = ['superfoods', 'supplements', 'beauty', 'wellness', 'drinks'];
  const tags = ['organic', 'vegan', 'gluten-free'];
  
  let created = 0;
  for (let i = 1; i <= 100; i++) {
    const uuid = uuidv4().substring(0, 8);
    const name = `Test Product ${i} ${uuid}`;
    const slug = `test-product-${i}-${uuid}`;
    
    try {
      await prisma.product.create({
        data: {
          name,
          slug,
          description: `A wonderful test product number ${i}`,
          photoUrl: `https://picsum.photos/600/600?random=${i}`,
          price: 19.99 + (i % 50),
          category: categories[i % categories.length],
          tags: [tags[i % tags.length]],
          inventory: 50,
          isActive: true,
          isArchived: false
        }
      });
      created++;
      
      if (i % 20 === 0) {
        console.log(`✅ Created ${created} products so far...`);
      }
    } catch (error) {
      console.error(`Error creating product ${i}:`, error.message);
    }
  }
  
  const total = await prisma.product.count({ where: { isActive: true } });
  console.log(`✅ Final result: ${created} new products created, ${total} total active products`);
  
  await prisma.$disconnect();
}

main().catch(console.error);