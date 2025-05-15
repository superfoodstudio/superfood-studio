import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

interface PlanConfig {
  name: string;
  description: string;
  amount: number; // in cents
  interval: 'month' | 'year';
  metadata: {
    planId: string;
  };
}

const plans: PlanConfig[] = [
  {
    name: 'Monthly Subscription',
    description: 'Access to all premium recipes and content. Billed monthly.',
    amount: 1499, // $14.99
    interval: 'month',
    metadata: {
      planId: 'MONTHLY',
    },
  },
  {
    name: 'Yearly Subscription',
    description: 'Access to all premium recipes and content. Billed yearly. Save over 15%!',
    amount: 14990, // $149.90 (equivalent to $12.49/month)
    interval: 'year',
    metadata: {
      planId: 'YEARLY',
    },
  },
];

async function createStripePlans() {
  try {
    console.log('Creating Stripe subscription plans...');
    
    for (const plan of plans) {
      // First, create the product
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        active: true,
        metadata: plan.metadata,
      });
      
      console.log(`Created product: ${product.name} (${product.id})`);
      
      // Then create the price for the product
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.amount,
        currency: 'usd',
        recurring: {
          interval: plan.interval,
        },
        metadata: plan.metadata,
      });
      
      console.log(`Created price: $${(price.unit_amount! / 100).toFixed(2)}/${plan.interval} (${price.id})`);
      console.log(`For ${plan.metadata.planId} plan, set STRIPE_${plan.metadata.planId}_PRICE_ID=${price.id} in your .env file`);
    }
    
    console.log('\nAll subscription plans created successfully!');
    console.log('Remember to update your environment variables with the price IDs above.');
  } catch (error) {
    console.error('Error creating Stripe plans:', error);
  }
}

// Run the script
createStripePlans(); 