import axios from 'axios';

const API_URL = '/api/users';

// Register a new user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response;
};

// Login user
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response;
};

// Get user profile
export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/me`);
  return response;
};

// Update user profile
export const updateProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/me`, userData);
  return response;
};

// Get all users (admin only)
export const getUsers = async () => {
  const response = await axios.get(API_URL);
  return response;
};

// Get user by ID (admin only)
export const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response;
};

// Delete user (admin only)
export const deleteUser = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response;
}; 