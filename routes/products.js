// routes/products.js
const express = require('express');
const db = require('../db/database');

const router = express.Router();

// GET /api/products?search=&category=
router.get('/', (req, res) => {
  const { search, category } = req.query;
  let products = db.get('products').value();

  if (category && category !== 'All') {
    products = products.filter((p) => p.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  const categories = [...new Set(db.get('products').value().map((p) => p.category))];
  res.json({ products, categories });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = db.get('products').find({ id }).value();
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json({ product });
});

module.exports = router;
