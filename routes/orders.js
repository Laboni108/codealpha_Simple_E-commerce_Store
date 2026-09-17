// routes/orders.js
const express = require('express');
const Product = require('../db/models/Product');
const Order = require('../db/models/Order');
const { requireAuth } = require('../middleware/auth');
const { hydrateCart, getCart } = require('./cart');

const router = express.Router();

// POST /api/orders  { shippingAddress }  -- checkout: turns current cart into an order
router.post('/', requireAuth, async (req, res) => {
  try {
    const cart = getCart(req);
    if (cart.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }

    const { shippingAddress } = req.body || {};
    if (!shippingAddress || !shippingAddress.trim()) {
      return res.status(400).json({ error: 'A shipping address is required.' });
    }

    const { items, total } = await hydrateCart(cart);

    // Re-check stock right before committing the order (it may have changed since the cart was last viewed)
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.qty) {
        return res.status(400).json({ error: `${item.name} no longer has enough stock.` });
      }
    }
    // Decrement stock for each item
    await Promise.all(
      items.map((item) => Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.qty } }))
    );

    const order = await Order.create({
      user: req.userId,
      items,
      total,
      shippingAddress: shippingAddress.trim(),
      status: 'Processing',
    });

    req.session.cart = [];
    res.status(201).json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Checkout failed: ' + err.message });
  }
});

// GET /api/orders  -- current user's order history
router.get('/', requireAuth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load orders: ' + err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.user.toString() !== req.userId) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json({ order });
  } catch (err) {
    res.status(404).json({ error: 'Order not found.' });
  }
});

module.exports = router;
