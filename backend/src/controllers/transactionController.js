const Transaction = require('../models/Transaction');

// GET /api/transactions
exports.getTransactions = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      category,
      search,
      sortBy = 'date',
      sortOrder = 'desc',
    } = req.query;

    const query = { userId: req.userId };

    if (type && ['income', 'expense'].includes(type)) query.type = type;
    if (category) query.category = category;
    if (search) {
      query.description = { $regex: search, $options: 'i' };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort(sort).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(query),
    ]);

    res.json({
      transactions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/transactions
exports.createTransaction = async (req, res, next) => {
  try {
    const { amount, description, category, type, date } = req.body;

    if (!amount || !description || !category || !type) {
      return res.status(400).json({ message: 'Amount, description, category and type are required.' });
    }

    const transaction = await Transaction.create({
      userId: req.userId,
      amount: parseFloat(amount),
      description: description.trim(),
      category,
      type,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({ transaction, message: 'Transaction created successfully!' });
  } catch (error) {
    next(error);
  }
};

// PUT /api/transactions/:id
exports.updateTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.userId });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    const { amount, description, category, type, date } = req.body;

    if (amount !== undefined) transaction.amount = parseFloat(amount);
    if (description !== undefined) transaction.description = description.trim();
    if (category !== undefined) transaction.category = category;
    if (type !== undefined) transaction.type = type;
    if (date !== undefined) transaction.date = new Date(date);

    await transaction.save();

    res.json({ transaction, message: 'Transaction updated successfully!' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found.' });
    }

    res.json({ message: 'Transaction deleted successfully!' });
  } catch (error) {
    next(error);
  }
};
