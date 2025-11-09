const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  unit: {
    type: String,
    required: true,
    default: 'kg'
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  minStock: {
    type: Number,
    default: 10
  },
  maxStock: {
    type: Number,
    default: 1000
  },
  price: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['in_stock', 'low_stock', 'out_of_stock'],
    default: 'in_stock'
  },
  description: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true // e.g., 'Pakistani', 'Indian', 'Chinese', etc.
  },
  image: {
    type: String,
    trim: true
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update status based on stock
inventorySchema.pre('save', function(next) {
  if (this.stock <= 0) {
    this.status = 'out_of_stock';
  } else if (this.stock <= this.minStock) {
    this.status = 'low_stock';
  } else {
    this.status = 'in_stock';
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);


