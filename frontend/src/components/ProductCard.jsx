function formatPrice(pence) {
  return `£${(pence / 100).toFixed(2)}`;
}

function Stars({ rating }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className="stars" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.floor(rounded);
        const half = !filled && n - 0.5 === rounded;
        return (
          <span
            key={n}
            className={`star${filled ? ' filled' : ''}${half ? ' half' : ''}`}
          >
            ★
          </span>
        );
      })}
    </span>
  );
}

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.stock < 20 && (
          <span className="product-badge">Only {product.stock} left</span>
        )}
      </div>
      <div className="product-body">
        <span className="product-artisan">{product.artisan}</span>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <Stars rating={product.rating} />
          <span className="product-reviews">({product.reviews})</span>
        </div>
        <div className="product-foot">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button
            className="add-button"
            onClick={() => onAddToCart(product.id)}
            aria-label={`Add ${product.name} to cart`}
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}