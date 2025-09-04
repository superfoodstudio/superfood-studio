#!/usr/bin/env npx tsx

import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testGraphQLEndpoint() {
  try {
    console.log('🚀 Testing GraphQL endpoint directly...\n');
    
    const query = `
      query TestRecipeBySlug($slug: String!) {
        recipeBySlug(slug: $slug) {
          id
          name
          slug
          description
          isPublished
          mediaUrl
          ingredients
          instructions
        }
      }
    `;
    
    const variables = {
      slug: 'green-goddess-smoothie'
    };
    
    console.log('Query:', query);
    console.log('Variables:', variables);
    console.log('Endpoint: http://localhost:3000/api/graphql\n');
    
    const response = await fetch('http://localhost:3000/api/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });
    
    console.log(`Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      console.log('❌ Response not OK');
      const text = await response.text();
      console.log('Response body:', text);
      return;
    }
    
    const result = await response.json();
    
    console.log('\n📊 GraphQL Response:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.errors) {
      console.log('\n❌ GraphQL Errors found:');
      result.errors.forEach((error: any, index: number) => {
        console.log(`  ${index + 1}. ${error.message}`);
        if (error.path) {
          console.log(`     Path: ${error.path.join('.')}`);
        }
      });
    }
    
    if (result.data?.recipeBySlug) {
      console.log('\n✅ Recipe found via GraphQL:');
      const recipe = result.data.recipeBySlug;
      console.log(`  ID: ${recipe.id}`);
      console.log(`  Name: ${recipe.name}`);
      console.log(`  Slug: ${recipe.slug}`);
      console.log(`  Published: ${recipe.isPublished}`);
      console.log(`  Has description: ${!!recipe.description}`);
      console.log(`  Has ingredients: ${!!recipe.ingredients}`);
      console.log(`  Has instructions: ${!!recipe.instructions}`);
    } else {
      console.log('\n❌ Recipe NOT found via GraphQL');
      console.log('Result data:', result.data);
    }
    
  } catch (error) {
    console.error('❌ Error testing GraphQL endpoint:', error);
  }
}

testGraphQLEndpoint();