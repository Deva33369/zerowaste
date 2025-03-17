const Category = require('../models/Category');

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Check if category already exists
    const categoryExists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (categoryExists) {
      res.status(400);
      throw new Error('Category already exists');
    }

    // Create category
    const category = await Category.create({
      name,
      description,
      icon
    });

    if (category) {
      res.status(201).json(category);
    } else {
      res.status(400);
      throw new Error('Invalid category data');
    }
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    res.json(category);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    // Check if updated name already exists (excluding current category)
    if (name && name !== category.name) {
      const categoryExists = await Category.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id }
      });
      
      if (categoryExists) {
        res.status(400);
        throw new Error('Category name already exists');
      }
    }

    // Update fields
    category.name = name || category.name;
    category.description = description || category.description;
    category.icon = icon || category.icon;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    await category.remove();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    res.json({
      message: error.message,
    });
  }
};

/**
 * @desc    Get category statistics
 * @route   GET /api/categories/stats
 * @access  Public
 */
const getCategoryStats = async (req, res) => {
  try {
    // This would typically join with the WasteItem collection to get counts
    // For now, we'll return a placeholder
    const categories = await Category.find({}).sort({ name: 1 });
    
    // In a real implementation, you would use aggregation to count items per category
    const stats = categories.map(category => ({
      _id: category._id,
      name: category.name,
      count: 0 // Placeholder for actual count
    }));
    
    res.json(stats);
  } catch (error) {
    res.status(500);
    res.json({
      message: error.message,
    });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryStats
}; 