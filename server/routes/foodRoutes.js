const express = require('express');
const router = express.Router();
const { 
  getAllFood,
  createFood,
  getFoodById,
  updateFood,
  deleteFood,
  getNearbyFood
} = require('../controllers/foodController');
const { protect, authorize } = require('../middleware/auth');

// GET all food donations - public
router.get('/', getAllFood);

// POST a new food donation - donor only
router.post('/', protect, authorize('donor'), createFood);

// GET food donations near a location - public
router.get('/nearby', getNearbyFood);

// GET a specific food donation - public
router.get('/:id', getFoodById);

// Update a food donation - donor only
router.put('/:id', protect, authorize('donor'), updateFood);

// Delete a food donation - donor only
router.delete('/:id', protect, authorize('donor'), deleteFood);

module.exports = router;