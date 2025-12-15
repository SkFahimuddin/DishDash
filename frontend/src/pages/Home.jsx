import React, { useState, useEffect } from 'react';
import { ChefHat, Search, Sparkles, Clock, Users, Flame, Heart } from 'lucide-react';
import { recipeAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    loadRandomSuggestions();
  }, []);

  const loadRandomSuggestions = async () => {
    try {
      const response = await recipeAPI.getSuggestions();
      console.log('Suggestions response:', response.data);
      setSuggestions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    setRecipe(null);

    try {
      const response = await recipeAPI.search(query);
      console.log('Search response:', response.data);
      setRecipe(response.data);
    } catch (error) {
      console.error('Error fetching recipe:', error);
      alert('Failed to fetch recipe. Please try again.');
    }
    setLoading(false);
  };

  const handleAddToFavorites = async (recipeId) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      await userAPI.addFavorite(recipeId);
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-800">AI Recipe Book</h1>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">Hello, {user.name}!</span>
                <a href="/favorites" className="text-orange-500 hover:text-orange-600">
                  <Heart className="w-6 h-6" />
                </a>
              </div>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for a dish or category (e.g., 'Pasta Carbonara' or 'Italian cuisine')"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none text-gray-700"
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Preparing your recipe...</p>
          </div>
        )}

        {!loading && recipe && recipe.type === 'recipe' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Recipe Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-bold mb-2">{recipe.name || 'Untitled Recipe'}</h2>
                  <p className="text-orange-100 text-lg">{recipe.cuisine || 'Unknown Cuisine'}</p>
                </div>
                {user && recipe._id && (
                  <button
                    onClick={() => handleAddToFavorites(recipe._id)}
                    className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-all"
                  >
                    <Heart className="w-6 h-6" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-6 mt-6">
                {recipe.prepTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Prep: {recipe.prepTime}</span>
                  </div>
                )}
                {recipe.cookTime && (
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    <span>Cook: {recipe.cookTime}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span>Serves: {recipe.servings}</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span>{recipe.difficulty}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              {/* Ingredients */}
              {recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-8 bg-orange-500 rounded"></div>
                    Ingredients
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                        <span className="text-gray-700">{ingredient}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Instructions */}
              {recipe.instructions && Array.isArray(recipe.instructions) && recipe.instructions.length > 0 && (
                <section className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-2 h-8 bg-red-500 rounded"></div>
                    Instructions
                  </h3>
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 pt-2">{instruction}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tips */}
              {recipe.tips && Array.isArray(recipe.tips) && recipe.tips.length > 0 && (
                <section>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    Pro Tips
                  </h3>
                  <div className="space-y-3">
                    {recipe.tips.map((tip, index) => (
                      <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="text-gray-700">{tip}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {!loading && recipe && recipe.type === 'category' && recipe.dishes && Array.isArray(recipe.dishes) && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{recipe.category || 'Category'}</h2>
            <p className="text-gray-600 mb-8">Discover delicious recipes from this category</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {recipe.dishes.map((dish, index) => (
                <div
                  key={index}
                  onClick={() => handleSearch(dish.name)}
                  className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-300"
                >
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{dish.name || 'Untitled'}</h3>
                  <p className="text-gray-600 mb-3">{dish.description || 'No description'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-orange-600">{dish.difficulty || 'Medium'}</span>
                    <span className="text-sm text-gray-500">Click to view recipe →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !recipe && Array.isArray(suggestions) && suggestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recipe Suggestions</h2>
              <button
                onClick={loadRandomSuggestions}
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all text-gray-700 font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Refresh
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSearch(suggestion.name)}
                  className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center mb-4">
                    <ChefHat className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{suggestion.name || 'Untitled'}</h3>
                  <p className="text-sm text-orange-600 font-semibold mb-2">{suggestion.cuisine || 'Unknown'}</p>
                  <p className="text-gray-600 text-sm">{suggestion.description || 'No description'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && !recipe && (!suggestions || suggestions.length === 0) && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to AI Recipe Book</h2>
            <p className="text-gray-600">Search for a recipe or cuisine to get started!</p>
          </div>
        )}
      </main>
    </div>
  );
}