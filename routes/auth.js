// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../db/models/User');

const router = express.Router();

function publicUser(user) {
  return { id: user._id.toString(), name: user.name, email: user.email };
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are all required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });

    req.session.userId = user._id.toString();
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    req.session.userId = user._id.toString();
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ user: null });
    const user = await User.findById(req.session.userId);
    if (!user) return res.json({ user: null });
    res.json({ user: publicUser(user) });
  } catch (err) {
    res.json({ user: null });
  }
});

module.exports = router;
