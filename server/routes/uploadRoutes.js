const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  uploadImage,
  uploadMultipleImages,
  deleteImage
} = require('../controllers/uploadController');

// All upload routes require authentication
router.post('/', protect, uploadImage);
router.post('/multiple', protect, uploadMultipleImages);
router.delete('/:filename', protect, deleteImage);

module.exports = router; 