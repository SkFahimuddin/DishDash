const Recipe = require('../models/Recipe');
const openaiService = require('../services/openaiService');

// Search or generate recipe
exports.searchRecipe = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // First, check if recipe exists in database
    const existingRecipe = await Recipe.findOne({
      name: new RegExp(query, 'i')
    });

    if (existingRecipe) {
      return res.json({
        type: 'recipe',
        source: 'database',
        ...existingRecipe.toObject()
      });
    }

    // If not found, generate with AI
    const aiResult = await openaiService.generateRecipe(query);

    // Save recipe to database if it's a full recipe
    if (aiResult.type === 'recipe') {
      const newRecipe = new Recipe({
        name: aiResult.name,
        cuisine: aiResult.cuisine,
        category: aiResult.category || 'other',
        difficulty: aiResult.difficulty || 'Medium',
        prepTime: aiResult.prepTime,
        cookTime: aiResult.cookTime,
        servings: aiResult.servings,
        ingredients: aiResult.ingredients || [],
        instructions: aiResult.instructions || [],
        tips: aiResult.tips || [],
        createdBy: req.user?._id,
        isAIGenerated: true
      });
      await newRecipe.save();
      
      return res.json({
        type: 'recipe',
        source: 'ai',
        _id: newRecipe._id,
        name: newRecipe.name,
        cuisine: newRecipe.cuisine,
        category: newRecipe.category,
        difficulty: newRecipe.difficulty,
        prepTime: newRecipe.prepTime,
        cookTime: newRecipe.cookTime,
        servings: newRecipe.servings,
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions,
        tips: newRecipe.tips
      });
    }

    // If it's a category result, return as is
    res.json({
      source: 'ai',
      ...aiResult
    });
  } catch (error) {
    console.error('Search recipe error:', error);
    res.status(500).json({ message: 'Failed to search recipe', error: error.message });
  }
};

// Get random suggestions
exports.getSuggestions = async (req, res) => {
  try {
    const suggestions = await openaiService.generateSuggestions();
    res.json(suggestions);
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ message: 'Failed to get suggestions', error: error.message });
  }
};

// Get all saved recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const { category, cuisine, difficulty } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (cuisine) filter.cuisine = new RegExp(cuisine, 'i');
    if (difficulty) filter.difficulty = difficulty;

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(recipes);
  } catch (error) {
    console.error('Get all recipes error:', error);
    res.status(500).json({ message: 'Failed to fetch recipes', error: error.message });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ message: 'Failed to fetch recipe', error: error.message });
  }
};

// Save custom recipe
exports.createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      createdBy: req.user._id,
      isAIGenerated: false
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ message: 'Failed to create recipe', error: error.message });
  }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ message: 'Failed to delete recipe', error: error.message });
  }
};