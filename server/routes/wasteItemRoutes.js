const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createWasteItem,
  getWasteItems,
  getUserWasteItems,
  getWasteItemById,
  updateWasteItem,
  deleteWasteItem,
  getNearbyWasteItems
} = require('../controllers/wasteItemController');

// Public routes
router.get('/', getWasteItems);

// User specific routes
router.get('/user/items', protect, getUserWasteItems);
router.get('/nearby', protect, getNearbyWasteItems);

// Item by ID route (should come after more specific routes)
router.get('/:id', getWasteItemById);

// Protected routes
router.post('/', protect, createWasteItem);
router.put('/:id', protect, updateWasteItem);
router.delete('/:id', protect, deleteWasteItem);

module.exports = router; 