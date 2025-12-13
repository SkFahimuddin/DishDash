import React from 'react';
import { Clock, Users, Flame, Sparkles, Heart } from 'lucide-react';

export default function RecipeDetail({ recipe, onAddToFavorites, showFavoriteButton }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Recipe Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">{recipe.name}</h2>
            <p className="text-orange-100 text-lg">{recipe.cuisine}</p>
          </div>
          {showFavoriteButton && (
            <button
              onClick={() => onAddToFavorites(recipe._id)}
              className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-all"
            >
              <Heart className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-6 mt-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>Prep: {recipe.prepTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <span>Cook: {recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <span>Serves: {recipe.servings}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span>{recipe.difficulty}</span>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Ingredients */}
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

        {/* Instructions */}
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

        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
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
  );
}