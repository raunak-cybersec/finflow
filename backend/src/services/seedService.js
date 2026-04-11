const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');

const seedService = async (userId) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Helper: random date within last N days from today
  const randomDate = (maxDaysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * maxDaysAgo));
    return d;
  };

  const seedTransactions = [
    // Income
    {
      userId,
      amount: 65000,
      description: 'Monthly Salary - Tech Corp',
      category: 'Salary',
      type: 'income',
      date: new Date(currentYear, currentMonth, 1),
    },
    {
      userId,
      amount: 12500,
      description: 'Freelance Web Project - Client A',
      category: 'Freelance',
      type: 'income',
      date: new Date(currentYear, currentMonth, 5),
    },
    {
      userId,
      amount: 8000,
      description: 'Freelance Design Work',
      category: 'Freelance',
      type: 'income',
      date: randomDate(20),
    },
    // Food
    {
      userId,
      amount: 2800,
      description: 'Weekly groceries - DMart',
      category: 'Food',
      type: 'expense',
      date: randomDate(7),
    },
    {
      userId,
      amount: 680,
      description: 'Lunch at Theobroma Cafe',
      category: 'Food',
      type: 'expense',
      date: randomDate(5),
    },
    {
      userId,
      amount: 1200,
      description: 'Weekend dinner outing',
      category: 'Food',
      type: 'expense',
      date: randomDate(3),
    },
    {
      userId,
      amount: 450,
      description: 'Swiggy order — biryani',
      category: 'Food',
      type: 'expense',
      date: randomDate(2),
    },
    // Transport
    {
      userId,
      amount: 1800,
      description: 'Monthly metro card recharge',
      category: 'Transport',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 2),
    },
    {
      userId,
      amount: 320,
      description: 'Uber rides this week',
      category: 'Transport',
      type: 'expense',
      date: randomDate(5),
    },
    // Housing
    {
      userId,
      amount: 18000,
      description: 'Monthly rent payment',
      category: 'Housing',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 1),
    },
    {
      userId,
      amount: 2200,
      description: 'Electricity & water bill',
      category: 'Housing',
      type: 'expense',
      date: randomDate(10),
    },
    // Health
    {
      userId,
      amount: 1500,
      description: 'Gym membership renewal',
      category: 'Health',
      type: 'expense',
      date: new Date(currentYear, currentMonth, 3),
    },
    // Entertainment
    {
      userId,
      amount: 649,
      description: 'Netflix + Spotify subscriptions',
      category: 'Entertainment',
      type: 'expense',
      date: randomDate(15),
    },
    // Shopping
    {
      userId,
      amount: 3200,
      description: 'Nike running shoes — Myntra',
      category: 'Shopping',
      type: 'expense',
      date: randomDate(12),
    },
    {
      userId,
      amount: 890,
      description: 'Books from Amazon',
      category: 'Shopping',
      type: 'expense',
      date: randomDate(8),
    },
  ];

  await Transaction.insertMany(seedTransactions);

  // Seed default budgets
  const defaultBudgets = [
    { userId, category: 'Food', monthlyLimit: 8000 },
    { userId, category: 'Transport', monthlyLimit: 3000 },
    { userId, category: 'Housing', monthlyLimit: 20000 },
    { userId, category: 'Health', monthlyLimit: 3000 },
    { userId, category: 'Entertainment', monthlyLimit: 2000 },
    { userId, category: 'Shopping', monthlyLimit: 5000 },
  ];

  await Budget.insertMany(defaultBudgets);

  console.log(`🌱 Seeded 15 transactions and 6 default budgets for user ${userId}`);
};

module.exports = seedService;
