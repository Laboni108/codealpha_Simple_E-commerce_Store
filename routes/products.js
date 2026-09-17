// routes/products.js
const express = require('express');
const Product = require('../db/models/Product');

const router = express.Router();

// GET /api/products?search=&category=
router.get('/', async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      const regex = new RegExp(String(search).trim(), 'i'); // case-insensitive partial match
      filter.$or = [{ name: regex }, { description: regex }];
    }

    const [products, categories] = await Promise.all([
      Product.find(filter).sort({ createdAt: 1 }),
      Product.distinct('category'),
    ]);

    res.json({ products, categories });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load products: ' + err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product });
  } catch (err) {
    // Invalid ObjectId format also lands here
    res.status(404).json({ error: 'Product not found.' });
  }
});

module.exports = router;
