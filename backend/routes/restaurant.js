const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Food = require('../models/Food');
const Order = require('../models/Order');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== 'restaurant' && payload.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = payload;
    next();
  } catch (err) { return res.status(401).json({ error: 'Invalid token' }); }
}

router.get('/foods', async (req, res) => {
  const foods = await Food.find({ category: 'restaurant' });
  res.json(foods);
});

router.get('/foods/:id/availability', async (req, res) => {
  const item = await Food.findById(req.params.id);
  if (!item || item.category !== 'restaurant') return res.status(404).json({ error: 'Item not found' });
  res.json({ available: item.available, quantity: item.quantity });
});

router.post('/orders', authMiddleware, async (req, res) => {
  const { itemId, quantity = 1, customer } = req.body || {};
  const item = await Food.findById(itemId);
  if (!item || item.category !== 'restaurant') return res.status(404).json({ error: 'Item not found' });
  if (!item.available || item.quantity < quantity) return res.status(400).json({ error: 'Not enough stock' });
  item.quantity -= quantity;
  if (item.quantity <= 0) item.available = false;
  await item.save();
  const order = await Order.create({ item: item._id, quantity, customer: customer || 'anonymous', category: 'restaurant', total: item.price * quantity });
  res.status(201).json(order);
});

router.get('/orders', authMiddleware, async (req, res) => {
  const orders = await Order.find({ category: 'restaurant' }).populate('item');
  res.json(orders);
});

module.exports = router;
