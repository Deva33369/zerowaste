const Request = require('../models/Request');
const WasteItem = require('../models/WasteItem');
const User = require('../models/User');

/**
 * @desc    Create a new request for a waste item
 * @route   POST /api/requests
 * @access  Private
 */
const createRequest = async (req, res) => {
  try {
    const { wasteItemId, message, pickupDate } = req.body;

    // Check if waste item exists
    const wasteItem = await WasteItem.findById(wasteItemId);
    if (!wasteItem) {
      res.status(404);
      throw new Error('Waste item not found');
    }

    // Check if waste item is available
    if (!wasteItem.isAvailable) {
      res.status(400);
      throw new Error('This waste item is no longer available');
    }

    // Check if user is not requesting their own waste item
    if (wasteItem.user.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot request your own waste item');
    }

    // Check if user already has a pending request for this item
    const existingRequest = await Request.findOne({
      requester: req.user._id,
      wasteItem: wasteItemId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingRequest) {
      res.status(400);
      throw new Error('You already have a pending or accepted request for this item');
    }

    // Create request
    const request = await Request.create({
      requester: req.user._id,
      provider: wasteItem.user,
      wasteItem: wasteItemId,
      message,
      pickupDate: pickupDate ? new Date(pickupDate) : null,
      status: 'pending'
    });

    if (request) {
      // Populate request with user and waste item details
      const populatedRequest = await Request.findById(request._id)
        .populate('requester', 'name email')
        .populate('provider', 'name email')
        .populate('wasteItem', 'title images');

      res.status(201).json(populatedRequest);
    } else {
      res.status(400);
      throw new Error('Invalid request data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get all requests for the logged-in user (as requester or provider)
 * @route   GET /api/requests
 * @access  Private
 */
const getUserRequests = async (req, res) => {
  try {
    // Get query parameters
    const status = req.query.status;
    const role = req.query.role || 'all'; // 'requester', 'provider', or 'all'
    
    // Build query
    let query = {};
    
    // Filter by status if provided
    if (status) {
      query.status = status;
    }
    
    // Filter by user role
    if (role === 'requester') {
      query.requester = req.user._id;
    } else if (role === 'provider') {
      query.provider = req.user._id;
    } else {
      // 'all' - get requests where user is either requester or provider
      query.$or = [
        { requester: req.user._id },
        { provider: req.user._id }
      ];
    }
    
    // Get requests
    const requests = await Request.find(query)
      .populate('requester', 'name email phone')
      .populate('provider', 'name email phone')
      .populate('wasteItem', 'title description images category condition')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get request by ID
 * @route   GET /api/requests/:id
 * @access  Private
 */
const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('requester', 'name email phone address')
      .populate('provider', 'name email phone address')
      .populate('wasteItem');

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    // Check if user is either the requester or provider
    if (
      request.requester._id.toString() !== req.user._id.toString() &&
      request.provider._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error('Not authorized to view this request');
    }

    res.json(request);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Update request status
 * @route   PUT /api/requests/:id
 * @access  Private
 */
const updateRequestStatus = async (req, res) => {
  try {
    const { status, message } = req.body;

    const request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    // Check if user is the provider (only provider can update status)
    if (request.provider.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this request');
    }

    // Validate status
    if (!['pending', 'accepted', 'rejected', 'completed', 'cancelled'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    // Update request
    request.status = status;
    
    // Add response message if provided
    if (message) {
      request.responseMessage = message;
    }
    
    // If accepting request, update pickup date if provided
    if (status === 'accepted' && req.body.pickupDate) {
      request.pickupDate = new Date(req.body.pickupDate);
    }
    
    // If completing request, mark waste item as unavailable
    if (status === 'completed') {
      const wasteItem = await WasteItem.findById(request.wasteItem);
      if (wasteItem) {
        wasteItem.isAvailable = false;
        await wasteItem.save();
      }
    }

    const updatedRequest = await request.save();

    // Populate and return updated request
    const populatedRequest = await Request.findById(updatedRequest._id)
      .populate('requester', 'name email phone')
      .populate('provider', 'name email phone')
      .populate('wasteItem', 'title images');

    res.json(populatedRequest);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Cancel request (by requester)
 * @route   PUT /api/requests/:id/cancel
 * @access  Private
 */
const cancelRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      res.status(404);
      throw new Error('Request not found');
    }

    // Check if user is the requester
    if (request.requester.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to cancel this request');
    }

    // Check if request can be cancelled
    if (!['pending', 'accepted'].includes(request.status)) {
      res.status(400);
      throw new Error(`Cannot cancel a request that is ${request.status}`);
    }

    // Update request status
    request.status = 'cancelled';
    request.cancelledAt = Date.now();
    
    // Add cancellation reason if provided
    if (req.body.reason) {
      request.cancellationReason = req.body.reason;
    }

    const updatedRequest = await request.save();

    res.json(updatedRequest);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get request statistics
 * @route   GET /api/requests/stats
 * @access  Private/Admin
 */
const getRequestStats = async (req, res) => {
  try {
    // Get total counts by status
    const stats = await Request.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats into an object
    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    // Get total count
    const totalCount = await Request.countDocuments();
    formattedStats.total = totalCount;

    res.json(formattedStats);
  } catch (error) {
    res.status(500);
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getUserRequests,
  getRequestById,
  updateRequestStatus,
  cancelRequest,
  getRequestStats
}; 