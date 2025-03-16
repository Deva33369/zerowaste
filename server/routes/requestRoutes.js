const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRequest,
  getUserRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
  getRequestStats
} = require('../controllers/requestController');

// Protected routes
router.post('/', protect, createRequest);
router.get('/', protect, getUserRequests);
router.get('/stats', protect, getRequestStats);
router.get('/:id', protect, getRequestById);
router.put('/:id', protect, updateRequestStatus);
router.put('/:id/cancel', protect, cancelRequest);

module.exports = router; 