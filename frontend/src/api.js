// Small fetch wrapper for the Zuri Market backend.
// VITE_API_URL is set in .env and embedded at build time.

const API_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const api = {
  getStoreConfig: () => request('/api/store/config'),
  getProducts: (category) =>
    request(`/api/products${category && category !== 'all' ? `?category=${category}` : ''}`),
  getFeatured: () => request('/api/products/featured'),
  validateCart: (items) =>
    request('/api/cart/validate', {
      method: 'POST',
      body: JSON.stringify({ items })
    })
};