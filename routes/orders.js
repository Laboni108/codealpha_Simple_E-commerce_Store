// routes/orders.js
const express = require('express');
const db = require('../db/database');
const { requireAuth } = require('../middleware/auth');
const { hydrateCart, getCart } = require('./cart');

const router = express.Router();

// POST /api/orders  { shippingAddress }  -- checkout: turns current cart into an order
router.post('/', requireAuth, (req, res) => {
  const cart = getCart(req);
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }

  const { shippingAddress } = req.body || {};
  if (!shippingAddress || !shippingAddress.trim()) {
    return res.status(400).json({ error: 'A shipping address is required.' });
  }

  const { items, total } = hydrateCart(cart);

  // Validate stock and decrement it atomically-ish (single-process demo app)
  for (const item of items) {
    const product = db.get('products').find({ id: item.productId }).value();
    if (!product || product.stock < item.qty) {
      return res.status(400).json({ error: `${item.name} no longer has enough stock.` });
    }
  }
  items.forEach((item) => {
    const product = db.get('products').find({ id: item.productId });
    product.assign({ stock: product.value().stock - item.qty }).write();
  });

  const id = db.get('nextOrderId').value();
  const order = {
    id,
    userId: req.userId,
    items,
    total,
    shippingAddress: shippingAddress.trim(),
    status: 'Processing',
    createdAt: new Date().toISOString(),
  };
  db.get('orders').push(order).write();
  db.set('nextOrderId', id + 1).write();

  req.session.cart = [];
  res.status(201).json({ order });
});

// GET /api/orders  -- current user's order history
router.get('/', requireAuth, (req, res) => {
  const orders = db
    .get('orders')
    .filter({ userId: req.userId })
    .sortBy('id')
    .reverse()
    .value();
  res.json({ orders });
});

// GET /api/orders/:id
router.get('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const order = db.get('orders').find({ id }).value();
  if (!order || order.userId !== req.userId) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  res.json({ order });
});

module.exports = router;
