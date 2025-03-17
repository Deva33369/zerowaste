const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
}

// Initialize upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

/**
 * @desc    Upload a single image
 * @route   POST /api/upload
 * @access  Private
 */
const uploadImage = (req, res) => {
  // Use multer upload instance
  const uploadSingle = upload.single('image');

  uploadSingle(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({ message: err.message });
    }

    // If no file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // File uploaded successfully
    res.json({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
      filename: req.file.filename,
    });
  });
};

/**
 * @desc    Upload multiple images (up to 5)
 * @route   POST /api/upload/multiple
 * @access  Private
 */
const uploadMultipleImages = (req, res) => {
  // Use multer upload instance for multiple files
  const uploadMultiple = upload.array('images', 5); // Max 5 images

  uploadMultiple(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred
      return res.status(400).json({ message: err.message });
    }

    // If no files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Files uploaded successfully
    const fileData = req.files.map((file) => ({
      path: `/${file.path}`,
      filename: file.filename,
    }));

    res.json({
      message: 'Images uploaded successfully',
      images: fileData,
      count: req.files.length,
    });
  });
};

/**
 * @desc    Delete an uploaded image
 * @route   DELETE /api/upload/:filename
 * @access  Private
 */
const deleteImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join('uploads', filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found' });
  }

  // Delete file
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: `Error deleting file: ${err.message}` });
    }

    res.json({ message: 'File deleted successfully' });
  });
};

module.exports = {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
};