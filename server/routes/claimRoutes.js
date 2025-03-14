const express = require('express');
const router = express.Router();
const {
  createClaim,
  getMyClaims,
  updateClaimStatus
} = require('../controllers/claimController');
const { protect, authorize } = require('../middleware/auth');

// Create a new claim (recipients only)
router.post('/', protect, authorize('recipient'), createClaim);

// Get all claims for the logged-in user (both donors and recipients)
router.get('/', protect, getMyClaims);

// Update claim status (donors only)
router.put('/:id', protect, authorize('donor'), updateClaimStatus);

module.exports = router; 