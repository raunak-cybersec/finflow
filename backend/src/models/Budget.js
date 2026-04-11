const mongoose = require('mongoose');
const { CATEGORIES } = require('./Transaction');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    monthlyLimit: {
      type: Number,
      required: true,
      min: [0, 'Budget cannot be negative'],
    },
  },
  { timestamps: true }
);

// Ensure one budget per category per user
budgetSchema.index({ userId: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
