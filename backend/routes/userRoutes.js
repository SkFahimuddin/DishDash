const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  addFavorite,
  removeFavorite
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:recipeId', protect, removeFavorite);

module.exports = router;
