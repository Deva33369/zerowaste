import axios from 'axios';

const API_URL = '/api/requests';

// Create a new request
export const createRequest = async (requestData) => {
  const response = await axios.post(API_URL, requestData);
  return response;
};

// Get user's requests
export const getUserRequests = async () => {
  const response = await axios.get(API_URL);
  return response;
};

// Get request by ID
export const getRequestById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response;
};

// Update request status
export const updateRequestStatus = async (id, status, message = '') => {
  const response = await axios.put(`${API_URL}/${id}`, { status, message });
  return response;
};

// Cancel a request
export const cancelRequest = async (id, message = '') => {
  const response = await axios.put(`${API_URL}/${id}/cancel`, { message });
  return response;
};

// Get request statistics
export const getRequestStats = async () => {
  const response = await axios.get(`${API_URL}/stats`);
  return response;
}; 