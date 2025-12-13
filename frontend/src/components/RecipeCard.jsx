import React from 'react';
import { ChefHat } from 'lucide-react';

export default function RecipeCard({ recipe, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-xl transition-all transform hover:-translate-y-1"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-400 rounded-lg flex items-center justify-center mb-4">
        <ChefHat className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{recipe.name}</h3>
      <p className="text-sm text-orange-600 font-semibold mb-2">{recipe.cuisine}</p>
      <p className="text-gray-600 text-sm">{recipe.description}</p>
    </div>
  );
}