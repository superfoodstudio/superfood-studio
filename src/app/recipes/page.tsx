'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';

interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  mediaUrl: string;
  isPremium: boolean;
}

export default function RecipesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  
  const router = useRouter();
  const { ready, authenticated } = usePrivy();
  
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setIsLoading(true);
        
        // In a real implementation, fetch recipes from the API
        // For now, using mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockRecipes: Recipe[] = [
          {
            id: '1',
            name: 'Energizing Açaí Bowl',
            description: 'Start your day with this antioxidant-rich açaí bowl topped with fresh fruits and granola.',
            category: 'breakfast',
            mediaUrl: 'https://placehold.co/600x400',
            isPremium: false,
          },
          {
            id: '2',
            name: 'Superfood Green Smoothie',
            description: 'A nutrient-packed green smoothie with spinach, kale, banana, and chia seeds.',
            category: 'drinks',
            mediaUrl: 'https://placehold.co/600x400',
            isPremium: false,
          },
          {
            id: '3',
            name: 'Turmeric Latte',
            description: 'Anti-inflammatory golden milk made with turmeric, ginger, and your choice of plant-based milk.',
            category: 'drinks',
            mediaUrl: 'https://placehold.co/600x400',
            isPremium: false,
          },
          {
            id: '4',
            name: 'Avocado Chocolate Mousse',
            description: 'Creamy, decadent chocolate mousse made with ripe avocados, cacao, and maple syrup.',
            category: 'desserts',
            mediaUrl: 'https://placehold.co/600x400',
            isPremium: true,
          },
          {
            id: '5',
            name: 'Quinoa Buddha Bowl',
            description: 'A balanced meal with quinoa, roasted vegetables, avocado, and tahini dressing.',
            category: 'mains',
            mediaUrl: 'https://placehold.co/600x400',
            isPremium: true,
          },
          {
            id: '6',
            name: 'Chia Seed Pudding',
            description: 'Overnight chia seed pudding with coconut milk, vanilla, and fresh berries.',
            category: 'breakfast',
            mediaUrl: 'https://placehold.co/600x400',
            isPremium: false,
          },
        ];
        
        setRecipes(mockRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchRecipes();
  }, []);
  
  // Get unique categories
  const categories = ['all', ...new Set(recipes.map(recipe => recipe.category))];
  
  // Filter recipes based on selected category and premium status
  const filteredRecipes = recipes.filter(recipe => {
    if (showPremiumOnly && !recipe.isPremium) {
      return false;
    }
    
    if (selectedCategory && selectedCategory !== 'all' && recipe.category !== selectedCategory) {
      return false;
    }
    
    return true;
  });
  
  function handleCategoryChange(category: string) {
    setSelectedCategory(category === 'all' ? null : category);
  }
  
  function handleRecipeClick(recipeId: string) {
    router.push(`/recipes/${recipeId}`);
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
          <p className="mt-4">Loading recipes...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-6">Superfood Recipes</h1>
      
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h2 className="text-lg mb-2">Filter by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm ${
                  (category === 'all' && !selectedCategory) || category === selectedCategory
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showPremiumOnly}
              onChange={() => setShowPremiumOnly(!showPremiumOnly)}
              className="mr-2"
            />
            Show Premium Recipes Only
          </label>
        </div>
      </div>
      
      {filteredRecipes.length === 0 ? (
        <div className="text-center py-8">
          <p>No recipes found with the selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <div className="relative">
                <img
                  src={recipe.mediaUrl}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                {recipe.isPremium && (
                  <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 m-2 rounded">
                    Premium
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-green-600 text-white text-xs px-2 py-1 m-2 rounded">
                  {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">{recipe.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{recipe.description}</p>
                {recipe.isPremium && !authenticated && (
                  <div className="mt-4 text-sm text-yellow-700">
                    <span className="font-medium">Subscribe</span> to unlock this recipe
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!authenticated && (
        <div className="mt-12 bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl mb-2">Unlock Premium Recipes</h2>
          <p className="mb-4">
            Subscribe to access our full collection of superfood recipes and more.
          </p>
          <button
            onClick={() => router.push('/subscription')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            View Subscription Plans
          </button>
        </div>
      )}
    </div>
  );
} 