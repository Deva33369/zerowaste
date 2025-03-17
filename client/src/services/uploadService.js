import axios from 'axios';

// Base URL for API requests
const API_URL = '/api';

/**
 * Upload a single image file
 * @param {File} file - The image file to upload
 * @returns {Promise} Promise object with upload response
 */
export const uploadImage = async (file) => {
  try {
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('image', file);

    // For development purposes, simulate a successful upload
    // Replace with actual API call when backend is ready
    // const response = await axios.post(`${API_URL}/upload/image`, formData, {
    //   headers: {
    //     'Content-Type': 'multipart/form-data'
    //   }
    // });
    
    // Simulate API response with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            url: URL.createObjectURL(file),
            filename: file.name,
            size: file.size
          }
        });
      }, 500);
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Upload multiple image files
 * @param {Array<File>} files - Array of image files to upload
 * @returns {Promise} Promise object with upload responses
 */
export const uploadMultipleImages = async (files) => {
  try {
    // For development, simulate uploads for all files
    // In production, this would be a single API call with all files in FormData
    
    // Mock response with object URLs
    const mockResponse = {
      data: files.map((file) => ({
        url: URL.createObjectURL(file),
        filename: file.name,
        size: file.size
      }))
    };
    
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockResponse);
      }, 800);
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete an uploaded image
 * @param {string} imageId - ID of image to delete
 * @returns {Promise} Promise object with deletion status
 */
export const deleteImage = async (imageId) => {
  try {
    const response = await axios.delete(`${API_URL}/upload/image/${imageId}`);
    return response;
  } catch (error) {
    throw error;
  }
};