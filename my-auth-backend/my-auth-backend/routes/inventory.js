const express = require('express');
const Inventory = require('../models/Inventory');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all inventory items with optional category filter
router.get('/', adminAuth, async (req, res) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } }
      ];
    }

    const items = await Inventory.find(query)
      .sort({ category: 1, name: 1 });

    // Get unique categories
    const categories = await Inventory.distinct('category');

    // Map items to include id field for compatibility
    const itemsWithId = items.map(item => ({
      ...item.toObject(),
      id: item._id.toString()
    }));

    res.json({
      success: true,
      count: itemsWithId.length,
      categories: categories,
      items: itemsWithId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get single inventory item
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      item: item
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Create inventory item
router.post('/', adminAuth, async (req, res) => {
  try {
    const item = new Inventory(req.body);
    await item.save();

    res.status(201).json({
      success: true,
      item: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: error.message
    });
  }
});

// Update inventory item
router.patch('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      item: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Update error',
      error: error.message
    });
  }
});

// Delete inventory item
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;

