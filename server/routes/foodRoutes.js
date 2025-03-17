const express = require('express');
const router = express.Router();
const { protect, donor } = require('../middleware/authMiddleware');
const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getMyDonations,
  getNearbyFood
} = require('../controllers/foodController');

// Public routes
router.get('/', getFoods);

// Donor routes - Need to come BEFORE /:id route
router.get('/my-donations', protect, donor, getMyDonations);

// Recipient routes - Need to come BEFORE /:id route
router.get('/nearby/:distance', protect, getNearbyFood);

// Item by ID route (should come after more specific routes)
router.get('/:id', getFoodById);

// Protected routes
router.post('/', protect, donor, createFood);
router.put('/:id', protect, donor, updateFood);
router.delete('/:id', protect, donor, deleteFood);

module.exports = router;