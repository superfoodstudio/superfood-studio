'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  mediaUrl: string;
  isPremium: boolean;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  nutritionFacts: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export default function RecipePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const { ready, authenticated } = usePrivy();
  
  const recipeId = params.id as string;
  
  useEffect(() => {
    async function fetchRecipe() {
      if (!recipeId) return;
      
      try {
        setIsLoading(true);
        
        // In a real implementation, fetch the recipe from the API
        // For now, using mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulating recipe retrieval
        const mockRecipe: Recipe = {
          id: recipeId,
          name: 'Energizing Açaí Bowl',
          description: 'Start your day with this antioxidant-rich açaí bowl topped with fresh fruits and granola. This superfood breakfast provides sustained energy and a wealth of nutrients to fuel your morning.',
          category: 'breakfast',
          mediaUrl: 'https://placehold.co/800x500',
          isPremium: recipeId === '4' || recipeId === '5',
          ingredients: [
            '2 frozen açaí packets',
            '1 frozen banana',
            '1/4 cup frozen blueberries',
            '1/4 cup almond milk',
            '1 tbsp honey or maple syrup',
            '1 tbsp chia seeds',
            'For topping: granola, sliced banana, berries, coconut flakes'
          ],
          instructions: [
            'Break the frozen açaí packets into pieces and place in a blender.',
            'Add frozen banana, blueberries, and almond milk.',
            'Blend until smooth, adding more almond milk if needed to reach desired consistency.',
            'Pour into a bowl and drizzle with honey or maple syrup.',
            'Top with granola, fresh fruit, and coconut flakes.',
            'Sprinkle chia seeds on top and serve immediately.'
          ],
          prepTime: 10,
          cookTime: 0,
          servings: 1,
          nutritionFacts: {
            calories: 420,
            protein: 8,
            carbs: 65,
            fat: 14,
            fiber: 12
          }
        };
        
        setRecipe(mockRecipe);
      } catch (err) {
        console.error('Error fetching recipe:', err);
        setError('Failed to load recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecipe();
  }, [recipeId]);
  
  // Check if premium content is accessible
  const isPremiumAccessible = !recipe?.isPremium || authenticated;
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4">Loading recipe...</p>
        </div>
      </div>
    );
  }
  
  if (error || !recipe) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <h1 className="text-xl mb-4">Error</h1>
          <p>{error || 'Recipe not found'}</p>
          <button
            onClick={() => router.push('/recipes')}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => router.push('/recipes')}
        className="mb-6 text-green-600 hover:text-green-700 flex items-center"
      >
        <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Recipes
      </button>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative">
          <img
            src={recipe.mediaUrl}
            alt={recipe.name}
            className="w-full h-64 md:h-96 object-cover"
          />
          {recipe.isPremium && (
            <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 m-4 rounded-full text-sm font-medium">
              Premium Recipe
            </div>
          )}
          <div className="absolute top-0 left-0 bg-green-600 text-white px-3 py-1 m-4 rounded-full text-sm">
            {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
          </div>
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{recipe.name}</h1>
          <p className="text-gray-700 mb-6">{recipe.description}</p>
          
          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Prep:</strong> {recipe.prepTime} min</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span><strong>Cook:</strong> {recipe.cookTime} min</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span><strong>Serves:</strong> {recipe.servings}</span>
            </div>
          </div>
          
          {!isPremiumAccessible ? (
            <div className="bg-yellow-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-medium mb-2">Premium Recipe</h2>
              <p className="mb-4">
                This premium recipe is available exclusively to our subscribers.
                Subscribe now to unlock this and other premium recipes.
              </p>
              <button
                onClick={() => router.push('/subscription')}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                View Subscription Plans
              </button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-4">Ingredients</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-medium mb-4">Instructions</h2>
                <ol className="list-decimal pl-5 space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
              
              <div>
                <h2 className="text-xl font-medium mb-4">Nutrition Facts</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="font-bold text-xl">{recipe.nutritionFacts.calories}</p>
                      <p className="text-sm text-gray-600">Calories</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl">{recipe.nutritionFacts.protein}g</p>
                      <p className="text-sm text-gray-600">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl">{recipe.nutritionFacts.carbs}g</p>
                      <p className="text-sm text-gray-600">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl">{recipe.nutritionFacts.fat}g</p>
                      <p className="text-sm text-gray-600">Fat</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-xl">{recipe.nutritionFacts.fiber}g</p>
                      <p className="text-sm text-gray-600">Fiber</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 