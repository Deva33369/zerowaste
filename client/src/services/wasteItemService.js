import axios from 'axios';

const API_URL = '/api/waste-items';

// Get all waste items with optional filters
export const getWasteItems = async (filters = {}) => {
  const { keyword, category, condition, page = 1, limit = 10 } = filters;
  
  let url = `${API_URL}?page=${page}&limit=${limit}`;
  
  if (keyword) url += `&keyword=${keyword}`;
  if (category) url += `&category=${category}`;
  if (condition) url += `&condition=${condition}`;
  
  const response = await axios.get(url);
  return response;
};

// Get waste item by ID
export const getWasteItemById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response;
};

// Create a new waste item
export const createWasteItem = async (wasteItemData) => {
  const response = await axios.post(API_URL, wasteItemData);
  return response;
};

// Update a waste item
export const updateWasteItem = async (id, wasteItemData) => {
  const response = await axios.put(`${API_URL}/${id}`, wasteItemData);
  return response;
};

// Delete a waste item
export const deleteWasteItem = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response;
};

// Get user's waste items
export const getUserWasteItems = async () => {
  const response = await axios.get(`${API_URL}/user/items`);
  return response;
};

// Get nearby waste items
export const getNearbyWasteItems = async (distance = 10) => {
  const response = await axios.get(`${API_URL}/nearby?distance=${distance}`);
  return response;
}; 