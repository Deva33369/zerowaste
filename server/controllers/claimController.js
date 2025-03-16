const Food = require('../models/Food');
const Claim = require('../models/Claim');
const { validateClaim } = require('../utils/validation');

/**
 * Claim a food donation
 * @route POST /api/claims
 * @access Private (recipients only)
 */
const createClaim = async (req, res) => {
  try {
    const { foodId, pickupTime, notes } = req.body;
    
    // Validate the claim data
    const { isValid, errors } = validateClaim(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    
    // Find the food item and check if it's available
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food donation not found' });
    }
    
    if (food.status !== 'available') {
      return res.status(400).json({ message: 'This food donation is no longer available' });
    }
    
    // Create the claim
    const claim = new Claim({
      food: foodId,
      donor: food.donor,
      recipient: req.user._id,
      pickupTime,
      notes
    });
    
    await claim.save();
    
    // Update the food status to 'claimed'
    food.status = 'claimed';
    await food.save();
    
    res.status(201).json({
      message: 'Claim created successfully',
      claim
    });
  } catch (error) {
    console.error('Error creating claim:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get claims made by the logged-in recipient
 * @route GET /api/claims/my-claims
 * @access Private (recipients only)
 */
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ recipient: req.user._id })
      .populate('food')
      .populate('donor', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get claims received by the logged-in donor
 * @route GET /api/claims/received
 * @access Private (donors only)
 */
const getReceivedClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ donor: req.user._id })
      .populate('food')
      .populate('recipient', 'name email phone')
      .sort({ createdAt: -1 });
    
    res.json(claims);
  } catch (error) {
    console.error('Error fetching received claims:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a specific claim by ID
 * @route GET /api/claims/:id
 * @access Private
 */
const getClaimById = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('food')
      .populate('donor', 'name email phone')
      .populate('recipient', 'name email phone');
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    // Check if the user is either the donor or recipient
    if (claim.donor._id.toString() !== req.user._id.toString() && 
        claim.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this claim' });
    }
    
    res.json(claim);
  } catch (error) {
    console.error('Error fetching claim:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update claim status
 * @route PUT /api/claims/:id
 * @access Private
 */
const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    // Check authorization based on the status change
    if ((status === 'approved' || status === 'rejected') && 
        claim.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the donor can approve or reject claims' });
    }
    
    if (status === 'cancelled' && 
        claim.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the recipient can cancel claims' });
    }
    
    // Update the claim
    claim.status = status;
    await claim.save();
    
    // If claim is cancelled or rejected, make the food available again
    if (status === 'cancelled' || status === 'rejected') {
      const food = await Food.findById(claim.food);
      if (food) {
        food.status = 'available';
        await food.save();
      }
    }
    
    res.json({
      message: `Claim ${status} successfully`,
      claim
    });
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a claim
 * @route DELETE /api/claims/:id
 * @access Private
 */
const deleteClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    // Only the recipient who created the claim can delete it
    if (claim.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this claim' });
    }
    
    // Only allow deletion if the claim is pending
    if (claim.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete a claim that is not pending' });
    }
    
    await claim.remove();
    
    // Make the food available again
    const food = await Food.findById(claim.food);
    if (food) {
      food.status = 'available';
      await food.save();
    }
    
    res.json({ message: 'Claim deleted successfully' });
  } catch (error) {
    console.error('Error deleting claim:', error);
    res.status(500).json({ message: error.message });
  }
};

// Helper function for status updates
const updateStatus = async (req, res, status) => {
  try {
    const claim = await Claim.findById(req.params.id);
    
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    claim.status = status;
    await claim.save();
    
    // If claim is completed, keep the food as claimed
    // If claim is rejected, make the food available again
    if (status === 'rejected') {
      const food = await Food.findById(claim.food);
      if (food) {
        food.status = 'available';
        await food.save();
      }
    }
    
    res.json({
      message: `Claim ${status} successfully`,
      claim
    });
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ message: error.message });
  }
};

// Approve a claim (donor only)
const approveClaim = async (req, res) => {
  return updateStatus(req, res, 'approved');
};

// Reject a claim (donor only)
const rejectClaim = async (req, res) => {
  return updateStatus(req, res, 'rejected');
};

// Mark a claim as completed (either donor or recipient)
const completeClaim = async (req, res) => {
  return updateStatus(req, res, 'completed');
};

module.exports = {
  createClaim,
  getMyClaims,
  getReceivedClaims,
  getClaimById,
  updateClaimStatus,
  deleteClaim,
  approveClaim,
  rejectClaim,
  completeClaim
}; 