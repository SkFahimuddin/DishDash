import React from 'react';
import { Sparkles } from 'lucide-react';
import RecipeCard from './RecipeCard';

export default function SuggestionGrid({ suggestions, onRefresh, onCardClick }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Recipe Suggestions</h2>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all text-gray-700 font-medium"
        >
          <Sparkles className="w-5 h-5" />
          Refresh
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <RecipeCard
            key={index}
            recipe={suggestion}
            onClick={() => onCardClick(suggestion.name)}
          />
        ))}
      </div>
    </div>
  );
}