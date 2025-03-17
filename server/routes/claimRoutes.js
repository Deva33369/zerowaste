const express = require('express');
const router = express.Router();
const { protect, donor, recipient } = require('../middleware/authMiddleware');
const {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  getClaimById,
  updateClaimStatus,
  deleteClaim,
  approveClaim,
  rejectClaim,
  completeClaim
} = require('../controllers/claimController');

// Recipient routes
router.post('/', protect, recipient, createClaim);
router.get('/my-claims', protect, recipient, getMyClaims);

// Donor routes
router.get('/received', protect, donor, getReceivedClaims);

// Common routes
router.get('/:id', protect, getClaimById);
router.put('/:id', protect, updateClaimStatus);
router.delete('/:id', protect, deleteClaim);

// Specific status update routes
router.put('/:id/approve', protect, donor, approveClaim);
router.put('/:id/reject', protect, donor, rejectClaim);
router.put('/:id/complete', protect, completeClaim);

module.exports = router; 