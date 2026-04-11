const Budget = require('../models/Budget');
const { CATEGORIES } = require('../models/Transaction');

// GET /api/budgets
exports.getBudgets = async (req, res, next) => {
  try {
    const budgets = await Budget.find({ userId: req.userId });
    res.json({ budgets });
  } catch (error) {
    next(error);
  }
};

// PUT /api/budgets  (upsert one category)
exports.upsertBudget = async (req, res, next) => {
  try {
    const { category, monthlyLimit } = req.body;

    if (!category || monthlyLimit === undefined) {
      return res.status(400).json({ message: 'Category and monthlyLimit are required.' });
    }

    if (!CATEGORIES.includes(category)) {
      return res.status(400).json({ message: 'Invalid category.' });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: req.userId, category },
      { monthlyLimit: parseFloat(monthlyLimit) },
      { upsert: true, new: true }
    );

    res.json({ budget, message: 'Budget updated successfully!' });
  } catch (error) {
    next(error);
  }
};
