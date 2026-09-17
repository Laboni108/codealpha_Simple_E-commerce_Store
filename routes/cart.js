// routes/cart.js
// Cart lives in the session, so it works for guests too (and persists across
// page loads via the session cookie). Checkout still requires login.

const express = require('express');
const db = require('../db/database');

const router = express.Router();

function getCart(req) {
  if (!req.session.cart) req.session.cart = []; // [{ productId, qty }]
  return req.session.cart;
}

function hydrateCart(cart) {
  const products = db.get('products').value();
  const items = cart
    .map((entry) => {
      const product = products.find((p) => p.id === entry.productId);
      if (!product) return null;
      return {
        productId: product.id,
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
router.get('/', (req, res) => {
  res.json(hydrateCart(getCart(req)));
});

// POST /api/cart  { productId, qty }
router.post('/', (req, res) => {
  const productId = Number(req.body.productId);
  const qty = Math.max(1, Number(req.body.qty) || 1);

  const product = db.get('products').find({ id: productId }).value();
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
  res.json(hydrateCart(cart));
});

// PUT /api/cart/:productId  { qty }
router.put('/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const qty = Number(req.body.qty);
  const product = db.get('products').find({ id: productId }).value();
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  if (!qty || qty < 1) return res.status(400).json({ error: 'Quantity must be at least 1.' });
  if (qty > product.stock) return res.status(400).json({ error: `Only ${product.stock} in stock.` });

  const cart = getCart(req);
  const item = cart.find((c) => c.productId === productId);
  if (!item) return res.status(404).json({ error: 'Item is not in the cart.' });
  item.qty = qty;
  req.session.cart = cart;
  res.json(hydrateCart(cart));
});

// DELETE /api/cart/:productId
router.delete('/:productId', (req, res) => {
  const productId = Number(req.params.productId);
  const cart = getCart(req).filter((c) => c.productId !== productId);
  req.session.cart = cart;
  res.json(hydrateCart(cart));
});

// DELETE /api/cart  (clear cart)
router.delete('/', (req, res) => {
  req.session.cart = [];
  res.json(hydrateCart([]));
});

module.exports = router;
module.exports.hydrateCart = hydrateCart;
module.exports.getCart = getCart;
