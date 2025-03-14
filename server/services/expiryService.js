const Food = require('../models/Food');
const User = require('../models/User');
const { sendEmail } = require('../utils/emailSender'); // You'll need to implement this

/**
 * Food expiry prediction and notification service
 */

/**
 * Predict food donations that will expire soon and need attention
 * @param {number} daysThreshold - Days threshold for expiry warning
 * @returns {Promise<Array>} - Array of food items that will expire soon
 */
const predictSoonToExpireFood = async (daysThreshold = 2) => {
  try {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);
    
    // Find food items that will expire within the threshold
    const expiringFood = await Food.find({
      status: 'available',
      expiryDate: { 
        $gte: now,
        $lte: thresholdDate 
      }
    }).populate('donor', 'name email');
    
    return expiringFood;
  } catch (error) {
    console.error('Error predicting soon-to-expire food:', error);
    throw new Error('Failed to predict expiring food items');
  }
};

/**
 * Send expiry alerts to donors and nearby recipients
 * @param {number} daysThreshold - Days threshold for expiry warning
 * @returns {Promise<Object>} - Results of the notification process
 */
const sendExpiryAlerts = async (daysThreshold = 2) => {
  try {
    const expiringFood = await predictSoonToExpireFood(daysThreshold);
    
    if (!expiringFood.length) {
      return { message: 'No expiring food items found' };
    }
    
    const notificationPromises = expiringFood.map(async (food) => {
      // 1. Notify the donor
      if (food.donor && food.donor.email) {
        await sendEmail({
          to: food.donor.email,
          subject: `Your food donation "${food.name}" will expire soon`,
          text: `Your donation "${food.name}" will expire in ${daysThreshold} days or less. Please consider updating the status if it's no longer available.`
        });
      }
      
      // 2. Find nearby recipients (optional enhancement)
      const nearbyRecipients = await User.find({
        userType: 'recipient',
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: food.location.coordinates
            },
            $maxDistance: 5000 // 5km radius
          }
        }
      }).limit(5);
      
      // 3. Notify nearby recipients
      const recipientNotifications = nearbyRecipients.map(recipient => {
        return sendEmail({
          to: recipient.email,
          subject: `Food available near you: ${food.name}`,
          text: `${food.name} is available near you and will expire soon. Claim it now to reduce food waste!`
        });
      });
      
      await Promise.all(recipientNotifications);
      
      return {
        foodId: food._id,
        donorNotified: !!food.donor,
        recipientsNotified: nearbyRecipients.length
      };
    });
    
    const results = await Promise.all(notificationPromises);
    return { 
      message: `Sent notifications for ${results.length} expiring food items`,
      details: results
    };
  } catch (error) {
    console.error('Error sending expiry alerts:', error);
    throw new Error('Failed to send expiry alerts');
  }
};

/**
 * Automatically update the status of expired food
 * @returns {Promise<Object>} - Results of the update process
 */
const markExpiredFood = async () => {
  try {
    const now = new Date();
    
    const result = await Food.updateMany(
      {
        status: 'available',
        expiryDate: { $lt: now }
      },
      {
        $set: { status: 'expired' }
      }
    );
    
    return { 
      message: `Marked ${result.modifiedCount} food items as expired`,
      modifiedCount: result.modifiedCount
    };
  } catch (error) {
    console.error('Error marking expired food:', error);
    throw new Error('Failed to mark expired food items');
  }
};

module.exports = {
  predictSoonToExpireFood,
  sendExpiryAlerts,
  markExpiredFood
}; 