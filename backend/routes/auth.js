const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

// Simple register for demo (creates users with role)
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body || {};
  if (!username || !role) return res.status(400).json({ error: 'username and role required' });
  try {
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = await User.create({ username, passwordHash, role });
    res.status(201).json({ id: user._id, username: user.username, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// login returns JWT
router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username required' });
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (user.passwordHash) {
    const ok = await bcrypt.compare(password || '', user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, role: user.role });
});

module.exports = router;
