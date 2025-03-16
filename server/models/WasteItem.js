const mongoose = require('mongoose');

const WasteItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  condition: {
    type: String,
    enum: ['new', 'likeNew', 'good', 'fair', 'poor'],
    default: 'good'
  },
  quantity: {
    type: Number,
    default: 1
  },
  images: [String],
  pickupDetails: {
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    instructions: String,
    availableTimes: [String]
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [Number] // [longitude, latitude]
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update 'updatedAt' on save
WasteItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add geospatial index for location-based queries
WasteItemSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('WasteItem', WasteItemSchema);