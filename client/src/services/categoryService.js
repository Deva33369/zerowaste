import axios from 'axios';

// Base URL for API requests
const API_URL = '/api';

/**
 * Get all categories
 * @returns {Promise} Promise object with categories data
 */
export const getCategories = async () => {
  try {
    // For now, return mock data since the API endpoint might not be ready
    // Replace this with actual API call when backend is ready
    // const response = await axios.get(`${API_URL}/categories`);
    // return response;
    
    // Mock data for development
    return {
      data: [
        { _id: '1', name: 'Furniture', icon: 'chair' },
        { _id: '2', name: 'Electronics', icon: 'devices' },
        { _id: '3', name: 'Clothing', icon: 'checkroom' },
        { _id: '4', name: 'Kitchen', icon: 'kitchen' },
        { _id: '5', name: 'Books', icon: 'menu_book' },
        { _id: '6', name: 'Tools', icon: 'handyman' },
        { _id: '7', name: 'Toys', icon: 'toys' },
        { _id: '8', name: 'Garden', icon: 'yard' },
        { _id: '9', name: 'Sports', icon: 'sports_soccer' },
        { _id: '10', name: 'Other', icon: 'more_horiz' }
      ]
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise} Promise object with category data
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Create a new category (admin only)
 * @param {object} categoryData - Category data
 * @returns {Promise} Promise object with created category
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await axios.post(`${API_URL}/categories`, categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Update category by ID (admin only)
 * @param {string} id - Category ID
 * @param {object} categoryData - Updated category data
 * @returns {Promise} Promise object with updated category
 */
export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData);
    return response;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete category by ID (admin only)
 * @param {string} id - Category ID
 * @returns {Promise} Promise object with deletion status
 */
export const deleteCategory = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response;
  } catch (error) {
    throw error;
  }
};