const express = require('express');
const router = express.Router();
const {
  searchRecipe,
  getSuggestions,
  getAllRecipes,
  getRecipeById,
  createRecipe,
  deleteRecipe
} = require('../controllers/recipeController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/search', optionalAuth, searchRecipe);
router.get('/suggestions', getSuggestions);
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', protect, createRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;