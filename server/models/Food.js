const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  description: String,
  images: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]  // [longitude, latitude]
  },
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['available', 'claimed', 'completed', 'expired'],
    default: 'available'
  },
  createdAt: { type: Date, default: Date.now }
});

// Add geospatial index for location-based queries
FoodSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Food', FoodSchema);