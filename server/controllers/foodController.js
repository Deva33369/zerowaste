const Food = require('../models/Food');

// Get all food donations
const getFoods = async (req, res) => {
  try {
    const foodItems = await Food.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new food donation
const createFood = async (req, res) => {
  try {
    // Add the logged-in user as the donor
    req.body.donor = req.user._id;
    
    const food = new Food(req.body);
    await food.save();
    res.status(201).json({ message: "Food donation added!", food });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a single food donation
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: "Food donation not found" });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a food donation
const updateFood = async (req, res) => {
  try {
    let food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: "Food donation not found" });
    }
    
    // Check if user is the donor
    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this donation" });
    }
    
    food = await Food.findByIdAndUpdate(req.params.id, req.body, { 
      new: true,
      runValidators: true 
    });
    
    res.json(food);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a food donation
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    
    if (!food) {
      return res.status(404).json({ message: "Food donation not found" });
    }
    
    // Check if user is the donor
    if (food.donor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this donation" });
    }
    
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food donation deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user's donations
const getMyDonations = async (req, res) => {
  try {
    const foodItems = await Food.find({ donor: req.user._id });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get nearby food donations
const getNearbyFood = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query; // maxDistance in meters (default: 10km)
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: "Longitude and latitude are required" });
    }
    
    const foodItems = await Food.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: "available"
    });
    
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getMyDonations,
  getNearbyFood
};