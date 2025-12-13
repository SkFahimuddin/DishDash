import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userAPI, recipeAPI } from '../services/api';
import Header from '../components/Header';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [user, navigate]);

  const loadFavorites = async () => {
    try {
      const response = await userAPI.getProfile();
      const favoriteRecipes = await Promise.all(
        response.data.favorites.map(id => recipeAPI.getById(id))
      );
      setFavorites(favoriteRecipes.map(r => r.data));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      await userAPI.removeFavorite(recipeId);
      setFavorites(favorites.filter(f => f._id !== recipeId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove from favorites');
    }
  };

  const handleRecipeClick = (recipeName) => {
    navigate('/', { state: { searchQuery: recipeName } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <Header />
        <LoadingSpinner message="Loading your favorites..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No favorites yet</h2>
            <p className="text-gray-600 mb-6">Start adding recipes to your favorites!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
            >
              Explore Recipes
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe) => (
              <div
                key={recipe._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-r from-orange-400 to-red-400 p-4">
                  <h3 className="text-white font-bold text-lg">{recipe.name}</h3>
                  <p className="text-orange-100 text-sm">{recipe.cuisine}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>{recipe.difficulty}</span>
                    <span>{recipe.servings} servings</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRecipeClick(recipe.name)}
                      className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-all"
                    >
                      View Recipe
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(recipe._id)}
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}