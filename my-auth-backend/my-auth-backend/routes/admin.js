const express = require('express');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all users (Admin only) - exclude deleted users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isDeleted: { $ne: true } })
      .select('-password -googleId')
      .sort({ createdAt: -1 }); // Newest first

    // Map users to include id field for compatibility
    const usersWithId = users.map(user => ({
      ...user.toObject(),
      id: user._id.toString()
    }));

    res.json({
      success: true,
      count: usersWithId.length,
      users: usersWithId
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Get user by ID (Admin only)
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -googleId');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Update user status (Admin only)
router.patch('/users/:id', adminAuth, async (req, res) => {
  try {
    const { isAdmin, role } = req.body;
    const updates = {};

    if (isAdmin !== undefined) updates.isAdmin = isAdmin;
    if (role !== undefined) updates.role = role;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    ).select('-password -googleId');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
});

// Delete user (Admin only) - Soft delete
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.params.id === req.userId.toString()) {
      return res.status(400).json({ 
        success: false,
        message: 'You cannot delete your own account' 
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.isDeleted) {
      return res.status(400).json({ 
        success: false,
        message: 'User is already deleted' 
      });
    }

    // Soft delete - mark as deleted instead of actually deleting
    user.isDeleted = true;
    user.deletedAt = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'User deleted successfully'
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

