// Zuri Market — Backend API
// REST API serving products, store config, and cart validation.

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { products, categories } = require('./data/products');

const app = express();

// --- Config from environment (with safe fallbacks) ---
const PORT = process.env.PORT || 4000;
const STORE_NAME = process.env.STORE_NAME || 'Zuri Market';
const CURRENCY = process.env.CURRENCY || 'GBP';
const API_SECRET_KEY = process.env.API_SECRET_KEY || 'dev-only-not-a-real-secret';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',');

// --- Middleware ---
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// --- Routes ---

app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/store/config', (req, res) => {
  res.json({
    storeName: STORE_NAME,
    currency: CURRENCY,
    tagline: 'Handcrafted African goods, delivered to Europe.',
    categories: categories
  });
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let result = products;
  if (category && category !== 'all') {
    result = products.filter(p => p.category === category);
  }
  res.json({ count: result.length, products: result });
});

app.get('/api/products/featured', (req, res) => {
  const featured = products.filter(p => p.featured);
  res.json({ count: featured.length, products: featured });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

app.post('/api/cart/validate', (req, res) => {
  const { items } = req.body || {};

  if (!Array.isArray(items)) {
    return res.status(400).json({ valid: false, error: 'items must be an array' });
  }

  const issues = [];
  let total = 0;

  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    if (!product) {
      issues.push({ id: item.id, reason: 'not_found' });
      continue;
    }
    if (item.quantity > product.stock) {
      issues.push({ id: item.id, reason: 'insufficient_stock', available: product.stock });
      continue;
    }
    total += product.price * item.quantity;
  }

  res.json({
    valid: issues.length === 0,
    issues: issues,
    total: total,
    currency: CURRENCY
  });
});

app.listen(PORT, () => {
  console.log(`Zuri Market API running on port ${PORT}`);
  console.log(`Store: ${STORE_NAME} | Currency: ${CURRENCY}`);
});