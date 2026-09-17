// routes/cart.js
// Cart contents live in the session (works for guests too, persists via the session
// cookie). Only the product lookups hit MongoDB. Product ids here are Mongo ObjectId
// strings (e.g. "664f1e..."), not numbers -- don't cast them with Number().

const express = require('express');
const Product = require('../db/models/Product');

const router = express.Router();

function getCart(req) {
  if (!req.session.cart) req.session.cart = []; // [{ productId, qty }]
  return req.session.cart;
}

async function hydrateCart(cart) {
  if (cart.length === 0) return { items: [], total: 0 };

  const products = await Product.find({ _id: { $in: cart.map((c) => c.productId) } });
  const items = cart
    .map((entry) => {
      const product = products.find((p) => p._id.toString() === entry.productId);
      if (!product) return null;
      return {
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock,
        qty: entry.qty,
        subtotal: Math.round(product.price * entry.qty * 100) / 100,
      };
    })
    .filter(Boolean);

  const total = Math.round(items.reduce((sum, i) => sum + i.subtotal, 0) * 100) / 100;
  return { items, total };
}

// GET /api/cart
router.get('/', async (req, res) => {
  try {
    res.json(await hydrateCart(getCart(req)));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load cart: ' + err.message });
  }
});

// POST /api/cart  { productId, qty }
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const qty = Math.max(1, Number(req.body.qty) || 1);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const cart = getCart(req);
    const existing = cart.find((c) => c.productId === productId);
    const currentQty = existing ? existing.qty : 0;

    if (currentQty + qty > product.stock) {
      return res.status(400).json({ error: `Only ${product.stock} in stock.` });
    }

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({ productId, qty });
    }
    req.session.cart = cart;
    res.json(await hydrateCart(cart));
  } catch (err) {
    res.status(400).json({ error: 'Could not add to cart: ' + err.message });
  }
});

// PUT /api/cart/:productId  { qty }
router.put('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const qty = Number(req.body.qty);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    if (!qty || qty < 1) return res.status(400).json({ error: 'Quantity must be at least 1.' });
    if (qty > product.stock) return res.status(400).json({ error: `Only ${product.stock} in stock.` });

    const cart = getCart(req);
    const item = cart.find((c) => c.productId === productId);
    if (!item) return res.status(404).json({ error: 'Item is not in the cart.' });
    item.qty = qty;
    req.session.cart = cart;
    res.json(await hydrateCart(cart));
  } catch (err) {
    res.status(400).json({ error: 'Could not update cart: ' + err.message });
  }
});

// DELETE /api/cart/:productId
router.delete('/:productId', async (req, res) => {
  const cart = getCart(req).filter((c) => c.productId !== req.params.productId);
  req.session.cart = cart;
  res.json(await hydrateCart(cart));
});

// DELETE /api/cart  (clear cart)
router.delete('/', async (req, res) => {
  req.session.cart = [];
  res.json(await hydrateCart([]));
});

module.exports = router;
module.exports.hydrateCart = hydrateCart;
module.exports.getCart = getCart;
