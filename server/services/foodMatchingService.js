const Food = require('../models/Food');
const User = require('../models/User');
const { calculateDistance } = require('../utils/geocoding');

/**
 * AI-powered food matching service
 * Matches available food donations to potential recipients based on:
 * - Location proximity
 * - Food expiry urgency
 * - User dietary preferences (if implemented)
 */

/**
 * Find the best matches for a food donation
 * @param {Object} foodItem - The food donation to match
 * @param {number} maxDistance - Maximum distance in kilometers
 * @param {number} limit - Maximum number of matches to return
 * @returns {Promise<Array>} - Array of potential recipients with match scores
 */
const findMatchesForFood = async (foodItem, maxDistance = 10, limit = 5) => {
  try {
    // Find recipients within the maximum distance
    const recipients = await User.find({
      userType: 'recipient',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: foodItem.location.coordinates
          },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      }
    });

    if (!recipients.length) {
      return [];
    }

    // Calculate match scores based on multiple factors
    const scoredMatches = recipients.map(recipient => {
      // 1. Calculate distance score (closer is better)
      const distance = calculateDistance(
        foodItem.location.coordinates,
        recipient.location.coordinates
      );
      const distanceScore = Math.max(0, 1 - (distance / maxDistance));

      // 2. Calculate urgency score based on expiry date
      const daysUntilExpiry = Math.max(0, 
        (new Date(foodItem.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      const expiryScore = daysUntilExpiry <= 1 ? 1 : daysUntilExpiry <= 3 ? 0.8 : 0.5;

      // 3. Calculate total score (can add more factors like dietary preferences later)
      const totalScore = (distanceScore * 0.6) + (expiryScore * 0.4);

      return {
        recipient,
        distance,
        daysUntilExpiry,
        score: totalScore
      };
    });

    // Sort by score (highest first) and limit results
    return scoredMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in food matching:', error);
    throw new Error('Failed to find matches for food donation');
  }
};

/**
 * Find the best food matches for a recipient
 * @param {Object} user - The recipient user
 * @param {number} maxDistance - Maximum distance in kilometers
 * @param {number} limit - Maximum number of matches to return
 * @returns {Promise<Array>} - Array of potential food donations with match scores
 */
const findFoodForRecipient = async (user, maxDistance = 10, limit = 10) => {
  try {
    // Find available food donations within the maximum distance
    const availableFoods = await Food.find({
      status: 'available',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.location.coordinates
          },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      }
    }).populate('donor', 'name');

    if (!availableFoods.length) {
      return [];
    }

    // Calculate match scores based on multiple factors
    const scoredMatches = availableFoods.map(food => {
      // 1. Calculate distance score (closer is better)
      const distance = calculateDistance(
        food.location.coordinates,
        user.location.coordinates
      );
      const distanceScore = Math.max(0, 1 - (distance / maxDistance));

      // 2. Calculate urgency score based on expiry date
      const daysUntilExpiry = Math.max(0, 
        (new Date(food.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
      );
      const expiryScore = daysUntilExpiry <= 1 ? 1 : daysUntilExpiry <= 3 ? 0.8 : 0.5;

      // 3. Calculate total score (can add more factors like dietary preferences later)
      const totalScore = (distanceScore * 0.5) + (expiryScore * 0.5);

      return {
        food,
        distance,
        daysUntilExpiry,
        score: totalScore
      };
    });

    // Sort by score (highest first) and limit results
    return scoredMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  } catch (error) {
    console.error('Error in food matching for recipient:', error);
    throw new Error('Failed to find food matches for recipient');
  }
};

module.exports = {
  findMatchesForFood,
  findFoodForRecipient
}; 