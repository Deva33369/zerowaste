const Food = require('../models/Food');
const Claim = require('../models/Claim'); // We'll define this model next
const { validateClaim } = require('../utils/validation'); // We'll need to add this validation

/**
 * Claim a food donation
 * @route POST /api/claims
 * @access Private (recipients only)
 */
exports.createClaim = async (req, res) => {
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
      return res.status(400).json({ message: `This food is already ${food.status}` });
    }
    
    // Create the claim
    const claim = new Claim({
      food: foodId,
      recipient: req.user._id,
      donor: food.donor,
      pickupTime,
      notes
    });
    
    await claim.save();
    
    // Update the food status to 'claimed'
    food.status = 'claimed';
    await food.save();
    
    res.status(201).json({
      message: 'Food claimed successfully',
      claim
    });
  } catch (error) {
    console.error('Error claiming food:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all claims made by the current user
 * @route GET /api/claims
 * @access Private
 */
exports.getMyClaims = async (req, res) => {
  try {
    let claims;
    
    if (req.user.userType === 'recipient') {
      // For recipients, get claims they made
      claims = await Claim.find({ recipient: req.user._id })
        .populate('food')
        .populate('donor', 'name phone')
        .sort({ createdAt: -1 });
    } else if (req.user.userType === 'donor') {
      // For donors, get claims on their donations
      claims = await Claim.find({ donor: req.user._id })
        .populate('food')
        .populate('recipient', 'name phone')
        .sort({ createdAt: -1 });
    }
    
    res.json(claims);
  } catch (error) {
    console.error('Error getting claims:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update claim status (for donors to approve/reject)
 * @route PUT /api/claims/:id
 * @access Private (donors only)
 */
exports.updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }
    
    // Check if the user is the donor of this claim
    if (claim.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this claim' });
    }
    
    // Update claim status
    claim.status = status;
    
    // If claim is rejected, make the food available again
    if (status === 'rejected') {
      const food = await Food.findById(claim.food);
      if (food) {
        food.status = 'available';
        await food.save();
      }
    } else if (status === 'completed') {
      // If claim is completed, update food status too
      const food = await Food.findById(claim.food);
      if (food) {
        food.status = 'completed';
        await food.save();
      }
    }
    
    await claim.save();
    
    res.json({
      message: `Claim ${status} successfully`,
      claim
    });
  } catch (error) {
    console.error('Error updating claim:', error);
    res.status(500).json({ message: error.message });
  }
}; 