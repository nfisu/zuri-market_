export default function Header({ storeName, cartCount, onCartClick }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="wordmark">
          <span className="wordmark-mark" aria-hidden="true">Z</span>
          <span className="wordmark-text">{storeName}</span>
        </div>

        <nav className="site-nav" aria-label="Primary">
          <a href="#catalogue">Shop</a>
          <a href="#featured">Featured</a>
          <a href="#story">Our story</a>
          <a href="#journal">Journal</a>
        </nav>

        <button
          className="cart-button"
          onClick={onCartClick}
          aria-label={`Open cart, ${cartCount} items`}
        >
          <span>Cart</span>
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}