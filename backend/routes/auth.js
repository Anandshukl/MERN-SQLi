const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_sqli_guardian_987!';
const JWT_EXPIRES = '7d';

/**
 * Helper: generate JWT token for a user
 */
function signToken(user) {
  return new Promise((resolve, reject) => {
    const payload = {
      user: {
        id: user._id || user.id,
        username: user.username,
      },
    };
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
}

// ──────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ──────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (password.length < 4) {
      return res.status(400).json({ msg: 'Password must be at least 4 characters' });
    }

    // Check if user already exists
    const existing = await User.findOne({ username: username.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username: username.toLowerCase().trim(),
      passwordHash,
    });
    await user.save();

    // Generate token
    const token = await signToken(user);

    res.status(201).json({
      token,
      username: user.username,
      msg: 'Account created successfully',
    });
  } catch (err) {
    console.error('Register error:', err.message);
    if (err.code === 11000) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
// ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Find user
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate token
    const token = await signToken(user);

    res.json({
      token,
      username: user.username,
    });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ──────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get current logged-in user info
// @access  Private
// ──────────────────────────────────────────────────────
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Auth/me error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
