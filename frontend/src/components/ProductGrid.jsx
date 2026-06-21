import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products, loading, onAddToCart }) {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="product-card skeleton" aria-hidden="true">
            <div className="product-image skeleton-block" />
            <div className="product-body">
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No products in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
      ))}
    </div>
  );
}