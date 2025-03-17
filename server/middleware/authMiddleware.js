const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes that require authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
};

/**
 * Middleware to restrict routes to donors only
 */
const donor = (req, res, next) => {
  if (req.user && req.user.userType === 'donor') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a donor');
  }
};

/**
 * Middleware to restrict routes to recipients only
 */
const recipient = (req, res, next) => {
  if (req.user && req.user.userType === 'recipient') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a recipient');
  }
};

/**
 * Middleware to restrict routes to admin users only
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

module.exports = { protect, donor, recipient, admin }; 