// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db/database');

const router = express.Router();

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are all required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = db.get('users').find({ email: normalizedEmail }).value();
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }

  const id = db.get('nextUserId').value();
  const passwordHash = bcrypt.hashSync(password, 10);
  const user = { id, name: name.trim(), email: normalizedEmail, passwordHash, createdAt: new Date().toISOString() };

  db.get('users').push(user).write();
  db.set('nextUserId', id + 1).write();

  req.session.userId = user.id;
  res.status(201).json({ user: publicUser(user) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = db.get('users').find({ email: normalizedEmail }).value();
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  req.session.userId = user.id;
  res.json({ user: publicUser(user) });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.session.userId) return res.json({ user: null });
  const user = db.get('users').find({ id: req.session.userId }).value();
  if (!user) return res.json({ user: null });
  res.json({ user: publicUser(user) });
});

module.exports = router;
