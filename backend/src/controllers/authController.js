const jwt = require('jsonwebtoken');
const User = require('../models/User');
const seedService = require('../services/seedService');

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const setCookie = (res, token) => {
  res.cookie('finflow_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: password,
    });

    // Seed sample data for new user
    await seedService(user._id);

    // Mark as seeded (use updateOne to avoid re-triggering pre-save hook)
    await User.updateOne({ _id: user._id }, { $set: { isSeeded: true } });

    const token = signToken(user._id);
    setCookie(res, token);

    res.status(201).json({
      message: 'Account created successfully!',
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user._id);
    setCookie(res, token);

    res.json({
      message: 'Logged in successfully!',
      user: { _id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('finflow_token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: 'Logged out successfully.' });
};

// GET /api/auth/me
exports.getMe = (req, res) => {
  res.json({ user: { _id: req.user._id, name: req.user.name, email: req.user.email } });
};
