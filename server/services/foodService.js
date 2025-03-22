const Food = require('../models/Food');
const User = require('../models/User');
const nodemailer = require('nodemailer');

/**
 * Check for expired food and update status
 */
const checkExpiredFood = async () => {
  try {
    const now = new Date();
    
    // Find all available food items that have expired
    const expiredFood = await Food.find({
      status: 'available',
      expiryDate: { $lt: now }
    }).populate('donor');
    
    if (expiredFood.length === 0) {
      console.log('No expired food found');
      return;
    }
    
    console.log(`Found ${expiredFood.length} expired food items`);
    
    // Update status to expired
    const updatePromises = expiredFood.map(food => 
      Food.findByIdAndUpdate(food._id, { status: 'expired' })
    );
    
    await Promise.all(updatePromises);
    
    // Notify donors about expired food
    await notifyDonorsAboutExpiredFood(expiredFood);
    
    return expiredFood;
  } catch (error) {
    console.error('Error checking expired food:', error);
    throw error;
  }
};

/**
 * Notify donors about their expired food
 */
const notifyDonorsAboutExpiredFood = async (expiredFood) => {
  // Group expired food by donor
  const foodByDonor = {};
  
  expiredFood.forEach(food => {
    if (food.donor) {
      const donorId = food.donor._id.toString();
      
      if (!foodByDonor[donorId]) {
        foodByDonor[donorId] = {
          donor: food.donor,
          foods: []
        };
      }
      
      foodByDonor[donorId].foods.push(food);
    }
  });
  
  // Skip if no donors to notify
  if (Object.keys(foodByDonor).length === 0) {
    return;
  }
  
  // Skip email sending if configuration is missing
  if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email configuration missing, skipping notification emails');
    return;
  }
  
  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // Send notifications to each donor
  for (const donorId in foodByDonor) {
    const { donor, foods } = foodByDonor[donorId];
    
    if (!donor.email) continue;
    
    const foodList = foods.map(food => 
      `- ${food.name} (${food.quantity} ${food.unit})`
    ).join('\n');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donor.email,
      subject: 'ZeroWaste: Your food donations have expired',
      text: `
Hello ${donor.name},

The following food donations you posted on ZeroWaste have expired:

${foodList}

These items have been marked as expired and are no longer visible to recipients.

Thank you for your contributions to reducing food waste!

Best regards,
The ZeroWaste Team
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Notification sent to donor: ${donor.email}`);
    } catch (error) {
      console.error(`Error sending notification to ${donor.email}:`, error);
    }
  }
};

/**
 * Predict food expiry and send alerts to donors
 */
const predictFoodExpiry = async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Set time to end of day
    tomorrow.setHours(23, 59, 59, 999);
    
    // Find food that will expire tomorrow
    const expiringFood = await Food.find({
      status: 'available',
      expiryDate: {
        $gte: new Date(),
        $lte: tomorrow
      }
    }).populate('donor');
    
    if (expiringFood.length === 0) {
      console.log('No food expiring soon');
      return;
    }
    
    console.log(`Found ${expiringFood.length} food items expiring soon`);
    
    // Notify donors about soon-to-expire food
    await notifyDonorsAboutExpiringFood(expiringFood);
    
    return expiringFood;
  } catch (error) {
    console.error('Error predicting food expiry:', error);
    throw error;
  }
};

/**
 * Notify donors about their soon-to-expire food
 */
const notifyDonorsAboutExpiringFood = async (expiringFood) => {
  // Group expiring food by donor
  const foodByDonor = {};
  
  expiringFood.forEach(food => {
    if (food.donor) {
      const donorId = food.donor._id.toString();
      
      if (!foodByDonor[donorId]) {
        foodByDonor[donorId] = {
          donor: food.donor,
          foods: []
        };
      }
      
      foodByDonor[donorId].foods.push(food);
    }
  });
  
  // Skip if no donors to notify
  if (Object.keys(foodByDonor).length === 0) {
    return;
  }
  
  // Skip email sending if configuration is missing
  if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email configuration missing, skipping notification emails');
    return;
  }
  
  // Create email transporter
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  
  // Send notifications to each donor
  for (const donorId in foodByDonor) {
    const { donor, foods } = foodByDonor[donorId];
    
    if (!donor.email) continue;
    
    const foodList = foods.map(food => 
      `- ${food.name} (${food.quantity} ${food.unit}) - Expires: ${food.expiryDate.toLocaleDateString()}`
    ).join('\n');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donor.email,
      subject: 'ZeroWaste: Your food donations are expiring soon',
      text: `
Hello ${donor.name},

The following food donations you posted on ZeroWaste will expire soon:

${foodList}

Consider promoting these items or adjusting their details to ensure they don't go to waste.

Thank you for your contributions to reducing food waste!

Best regards,
The ZeroWaste Team
      `
    };
    
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Expiry alert sent to donor: ${donor.email}`);
    } catch (error) {
      console.error(`Error sending expiry alert to ${donor.email}:`, error);
    }
  }
};

/**
 * Find nearby food based on user location and preferences
 */
const findNearbyFood = async (userId, maxDistance = 10000) => {
  try {
    // Get user with location
    const user = await User.findById(userId);
    
    if (!user || !user.location || !user.location.coordinates) {
      throw new Error('User location not available');
    }
    
    // Find available food near the user
    const nearbyFood = await Food.find({
      status: 'available',
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: user.location.coordinates
          },
          $maxDistance: maxDistance // in meters
        }
      },
      expiryDate: { $gt: new Date() }
    }).populate('donor', 'name address');
    
    return nearbyFood;
  } catch (error) {
    console.error('Error finding nearby food:', error);
    throw error;
  }
};

module.exports = {
  checkExpiredFood,
  predictFoodExpiry,
  findNearbyFood
}; 