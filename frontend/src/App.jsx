import { useState, useEffect } from 'react';
import { api } from './api.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import FeaturedSection from './components/FeaturedSection.jsx';
import CategoryFilter from './components/CategoryFilter.jsx';
import ProductGrid from './components/ProductGrid.jsx';
import Footer from './components/Footer.jsx';
import Cart from './components/Cart.jsx';
import './App.css';

export default function App() {
  const [storeConfig, setStoreConfig] = useState(null);
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [category, setCategory] = useState('all');
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStoreConfig(), api.getFeatured()])
      .then(([config, featuredRes]) => {
        setStoreConfig(config);
        setFeatured(featuredRes.products);
      })
      .catch(err => console.error('Failed to load initial data:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getProducts(category)
      .then(res => {
        setProducts(res.products);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load products:', err);
        setLoading(false);
      });
  }, [category]);

  const storeName = storeConfig?.storeName || 'Zuri Market';
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const addToCart = (productId) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const updateCartQty = (productId, qty) => {
    setCart(prev => {
      const next = { ...prev };
      if (qty <= 0) delete next[productId];
      else next[productId] = qty;
      return next;
    });
  };

  return (
    <div className="app">
      <Header
        storeName={storeName}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      <Hero tagline={storeConfig?.tagline} />

      <FeaturedSection
        products={featured}
        onAddToCart={addToCart}
      />

      <section className="catalogue" id="catalogue">
        <div className="catalogue-header">
          <span className="eyebrow">The catalogue</span>
          <h2 className="section-title">Browse the collection</h2>
        </div>
        <CategoryFilter
          categories={storeConfig?.categories || []}
          active={category}
          onChange={setCategory}
        />
        <ProductGrid
          products={products}
          loading={loading}
          onAddToCart={addToCart}
        />
      </section>

      <Footer storeName={storeName} />

      {cartOpen && (
        <Cart
          cart={cart}
          products={[...products, ...featured]}
          currency={storeConfig?.currency || 'GBP'}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateCartQty}
        />
      )}
    </div>
  );
}