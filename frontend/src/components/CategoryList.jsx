import React from 'react';

export default function CategoryList({ category, dishes, onDishClick }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-2">{category}</h2>
      <p className="text-gray-600 mb-8">Discover delicious recipes from this category</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {dishes.map((dish, index) => (
          <div
            key={index}
            onClick={() => onDishClick(dish.name)}
            className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all border-2 border-transparent hover:border-orange-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">{dish.name}</h3>
            <p className="text-gray-600 mb-3">{dish.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-orange-600">{dish.difficulty}</span>
              <span className="text-sm text-gray-500">Click to view recipe →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}