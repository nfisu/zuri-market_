import { useEffect, useState } from 'react';
import { api } from '../api.js';

function formatPrice(pence, currency = 'GBP') {
  const symbol = currency === 'GBP' ? '£' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '';
  return `${symbol}${(pence / 100).toFixed(2)}`;
}

export default function Cart({ cart, products, currency, onClose, onUpdateQty }) {
  const [validation, setValidation] = useState(null);
  const [validating, setValidating] = useState(false);

  // Build line items by matching cart IDs to product data
  const lines = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean);

  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  // Validate against the backend whenever the cart changes
  useEffect(() => {
    if (lines.length === 0) {
      setValidation(null);
      return;
    }
    setValidating(true);
    const items = lines.map((l) => ({ id: l.product.id, quantity: l.qty }));
    api.validateCart(items)
      .then(setValidation)
      .catch(() => setValidation(null))
      .finally(() => setValidating(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(cart)]);

  return (
    <div className="cart-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Shopping cart"
      >
        <header className="cart-header">
          <span className="eyebrow">Your basket</span>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">×</button>
        </header>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <p>Your basket is empty.</p>
            <button className="link-button" onClick={onClose}>Continue browsing</button>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {lines.map(({ product, qty }) => (
                <li key={product.id} className="cart-line">
                  <img src={product.image} alt="" className="cart-line-image" />
                  <div className="cart-line-body">
                    <span className="cart-line-name">{product.name}</span>
                    <span className="cart-line-artisan">{product.artisan}</span>
                    <div className="cart-line-controls">
                      <button
                        onClick={() => onUpdateQty(product.id, qty - 1)}
                        aria-label="Decrease quantity"
                      >−</button>
                      <span className="cart-line-qty">{qty}</span>
                      <button
                        onClick={() => onUpdateQty(product.id, qty + 1)}
                        aria-label="Increase quantity"
                      >+</button>
                    </div>
                  </div>
                  <span className="cart-line-price">
                    {formatPrice(product.price * qty, currency)}
                  </span>
                </li>
              ))}
            </ul>

            <footer className="cart-footer">
              <div className="cart-totals">
                <span>Subtotal</span>
                <span className="cart-total">{formatPrice(subtotal, currency)}</span>
              </div>
              {validation && !validation.valid && (
                <div className="cart-warning">
                  Some items can't be fulfilled — adjust quantities to continue.
                </div>
              )}
              <button
                className="checkout-button"
                disabled={validating || (validation && !validation.valid)}
              >
                {validating ? 'Checking stock…' : 'Checkout'}
              </button>
              <p className="cart-fine-print">
                Free shipping to the UK on orders over £75.
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}