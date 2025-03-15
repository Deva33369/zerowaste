const axios = require('axios');

/**
 * Geocodes an address to get coordinates (latitude, longitude)
 * Uses OpenStreetMap's Nominatim API as it's free to use
 * 
 * @param {Object} address - Address object containing address components
 * @param {string} address.street - Street address
 * @param {string} address.city - City
 * @param {string} address.state - State/province
 * @param {string} address.zipCode - Postal/ZIP code
 * @returns {Promise<Array>} - Returns [longitude, latitude] coordinates
 */
const geocodeAddress = async (address) => {
  try {
    // Combine address components
    const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
    
    // Call the Nominatim API (OpenStreetMap's geocoding service)
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: fullAddress,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'ZeroWaste Marketplace Application'
      }
    });

    // Check if results were found
    if (response.data && response.data.length > 0) {
      const { lon, lat } = response.data[0];
      // Return as [longitude, latitude] format for MongoDB geospatial queries
      return [parseFloat(lon), parseFloat(lat)];
    }
    
    throw new Error('Location not found');
  } catch (error) {
    console.error('Geocoding error:', error.message);
    throw new Error('Failed to geocode address');
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 * 
 * @param {Array} coords1 - [longitude, latitude] of first point
 * @param {Array} coords2 - [longitude, latitude] of second point
 * @returns {number} - Distance in kilometers
 */
const calculateDistance = (coords1, coords2) => {
  // Haversine formula implementation
  const toRad = value => (value * Math.PI) / 180;
  
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = {
  geocodeAddress,
  calculateDistance
};
