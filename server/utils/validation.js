/**
 * Food donation validation
 * Validates the required fields and formats for food donations
 */
const validateFoodDonation = (data) => {
  const errors = {};

  // Required fields validation
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Food name is required';
  }

  if (!data.quantity || isNaN(data.quantity) || data.quantity <= 0) {
    errors.quantity = 'Valid quantity is required';
  }

  if (!data.unit || data.unit.trim() === '') {
    errors.unit = 'Unit of measurement is required';
  }

  if (!data.expiryDate) {
    errors.expiryDate = 'Expiry date is required';
  } else {
    // Check if expiry date is in the future
    const expiry = new Date(data.expiryDate);
    const now = new Date();
    
    if (isNaN(expiry.getTime())) {
      errors.expiryDate = 'Invalid date format';
    } else if (expiry < now) {
      errors.expiryDate = 'Expiry date must be in the future';
    }
  }

  // Location validation
  if (!data.location || !data.location.coordinates) {
    errors.location = 'Location coordinates are required';
  } else if (
    !Array.isArray(data.location.coordinates) || 
    data.location.coordinates.length !== 2 ||
    isNaN(data.location.coordinates[0]) || 
    isNaN(data.location.coordinates[1])
  ) {
    errors.location = 'Valid location coordinates [longitude, latitude] are required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * User registration validation
 * Validates the required fields and formats for user registration
 */
const validateUserRegistration = (data) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Required fields validation
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
  }

  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (!data.userType || !['donor', 'recipient'].includes(data.userType)) {
    errors.userType = 'User type must be either donor or recipient';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate food claim data
 * @param {Object} data - The claim data
 * @returns {Object} - Validation result
 */
const validateClaim = (data) => {
  const errors = {};

  // Food ID validation
  if (!data.foodId) {
    errors.foodId = 'Food ID is required';
  }

  // Pickup time validation
  if (!data.pickupTime) {
    errors.pickupTime = 'Pickup time is required';
  } else {
    const pickupDate = new Date(data.pickupTime);
    const now = new Date();
    
    if (isNaN(pickupDate.getTime())) {
      errors.pickupTime = 'Invalid date format';
    } else if (pickupDate < now) {
      errors.pickupTime = 'Pickup time must be in the future';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateFoodDonation,
  validateUserRegistration,
  validateClaim
};
