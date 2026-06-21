import ProductCard from './ProductCard.jsx';

export default function FeaturedSection({ products, onAddToCart }) {
  if (!products || products.length === 0) return null;

  return (
    <section id="featured" className="featured">
      <div className="featured-header">
        <span className="eyebrow">This month's selection</span>
        <h2 className="section-title">Featured pieces</h2>
        <p className="section-lede">
          Chosen by our buyers in Lagos and London. Limited stock, restocked seasonally.
        </p>
      </div>
      <div className="featured-grid">
        {products.slice(0, 4).map((p) => (
          <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
}