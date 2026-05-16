const express = require('express');
const router = express.Router();
const store = require('../data/store');

function generateToken(prefix, user) {
  return `${prefix}-token-${user || 'guest'}`;
}

router.post('/login', (req, res) => {
  const { username } = req.body || {};
  const token = generateToken('bakery', username || 'user');
  res.json({ token });
});

router.get('/foods', (req, res) => {
  res.json(store.bakeryFoods);
});

router.get('/foods/:id/availability', (req, res) => {
  const id = Number(req.params.id);
  const item = store.bakeryFoods.find(f => f.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json({ available: item.available, quantity: item.quantity });
});

router.post('/orders', (req, res) => {
  const { itemId, quantity = 1, customer } = req.body || {};
  const id = Number(itemId);
  const item = store.bakeryFoods.find(f => f.id === id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (!item.available || item.quantity < quantity) {
    return res.status(400).json({ error: 'Item not available in requested quantity' });
  }
  item.quantity -= quantity;
  if (item.quantity <= 0) item.available = false;
  const order = {
    id: store.bakeryOrders.length + 1,
    item: { id: item.id, name: item.name, price: item.price },
    quantity,
    customer: customer || 'anonymous',
    createdAt: new Date().toISOString()
  };
  store.bakeryOrders.push(order);
  res.status(201).json(order);
});

router.get('/orders', (req, res) => {
  res.json(store.bakeryOrders);
});

module.exports = router;
