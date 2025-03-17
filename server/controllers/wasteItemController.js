const WasteItem = require('../models/WasteItem');
const User = require('../models/User');

/**
 * @desc    Create a new waste item
 * @route   POST /api/waste-items
 * @access  Private
 */
const createWasteItem = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      category, 
      condition, 
      quantity, 
      images, 
      pickupDetails,
      isAvailable 
    } = req.body;

    // Create waste item
    const wasteItem = await WasteItem.create({
      user: req.user._id,
      title,
      description,
      category,
      condition,
      quantity,
      images,
      pickupDetails,
      isAvailable: isAvailable !== undefined ? isAvailable : true
    });

    if (wasteItem) {
      res.status(201).json(wasteItem);
    } else {
      res.status(400);
      throw new Error('Invalid waste item data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get all waste items
 * @route   GET /api/waste-items
 * @access  Public
 */
const getWasteItems = async (req, res) => {
  try {
    // Build query based on filters
    const query = { isAvailable: true };
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by condition if provided
    if (req.query.condition) {
      query.condition = req.query.condition;
    }

    // Filter by search term if provided
    if (req.query.keyword) {
      query.$or = [
        { title: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const count = await WasteItem.countDocuments(query);
    
    // Get waste items
    const wasteItems = await WasteItem.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      wasteItems,
      page,
      pages: Math.ceil(count / limit),
      total: count
    });
  } catch (error) {
    res.status(500);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get waste items by user
 * @route   GET /api/waste-items/user
 * @access  Private
 */
const getUserWasteItems = async (req, res) => {
  try {
    const wasteItems = await WasteItem.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(wasteItems);
  } catch (error) {
    res.status(500);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get waste item by ID
 * @route   GET /api/waste-items/:id
 * @access  Public
 */
const getWasteItemById = async (req, res) => {
  try {
    const wasteItem = await WasteItem.findById(req.params.id)
      .populate('user', 'name email phone userType');

    if (!wasteItem) {
      res.status(404);
      throw new Error('Waste item not found');
    }

    res.json(wasteItem);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Update waste item
 * @route   PUT /api/waste-items/:id
 * @access  Private
 */
const updateWasteItem = async (req, res) => {
  try {
    const wasteItem = await WasteItem.findById(req.params.id);

    if (!wasteItem) {
      res.status(404);
      throw new Error('Waste item not found');
    }

    // Check if user is the owner of the waste item
    if (wasteItem.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this waste item');
    }

    // Update fields
    const {
      title,
      description,
      category,
      condition,
      quantity,
      images,
      pickupDetails,
      isAvailable
    } = req.body;

    wasteItem.title = title || wasteItem.title;
    wasteItem.description = description || wasteItem.description;
    wasteItem.category = category || wasteItem.category;
    wasteItem.condition = condition || wasteItem.condition;
    wasteItem.quantity = quantity || wasteItem.quantity;
    wasteItem.images = images || wasteItem.images;
    
    if (pickupDetails) {
      wasteItem.pickupDetails = {
        address: pickupDetails.address || wasteItem.pickupDetails?.address,
        instructions: pickupDetails.instructions || wasteItem.pickupDetails?.instructions,
        availableTimes: pickupDetails.availableTimes || wasteItem.pickupDetails?.availableTimes
      };
    }
    
    if (isAvailable !== undefined) {
      wasteItem.isAvailable = isAvailable;
    }

    const updatedWasteItem = await wasteItem.save();
    res.json(updatedWasteItem);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Delete waste item
 * @route   DELETE /api/waste-items/:id
 * @access  Private
 */
const deleteWasteItem = async (req, res) => {
  try {
    const wasteItem = await WasteItem.findById(req.params.id);

    if (!wasteItem) {
      res.status(404);
      throw new Error('Waste item not found');
    }

    // Check if user is the owner of the waste item
    if (wasteItem.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this waste item');
    }

    await wasteItem.remove();
    res.json({ message: 'Waste item removed' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get nearby waste items
 * @route   GET /api/waste-items/nearby
 * @access  Private
 */
const getNearbyWasteItems = async (req, res) => {
  try {
    // Get user's location
    const user = await User.findById(req.user._id);
    
    if (!user || !user.location || !user.location.coordinates) {
      res.status(400);
      throw new Error('User location not available. Please update your profile with an address.');
    }
    
    // Get max distance from query params (in kilometers) or default to 10km
    const maxDistance = parseInt(req.query.distance) || 10;
    
    // Find waste items near the user
    const wasteItems = await WasteItem.find({
      isAvailable: true,
      'location': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.location.coordinates
          },
          $maxDistance: maxDistance * 1000 // Convert to meters
        }
      }
    }).populate('user', 'name email');
    
    res.json(wasteItems);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  createWasteItem,
  getWasteItems,
  getUserWasteItems,
  getWasteItemById,
  updateWasteItem,
  deleteWasteItem,
  getNearbyWasteItems
}; 