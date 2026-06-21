export default function Footer({ storeName }) {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <span className="wordmark-mark" aria-hidden="true">Z</span>
          <span className="wordmark-text">{storeName}</span>
        </div>
        <div className="footer-cols">
          <div>
            <span className="eyebrow">Shop</span>
            <ul>
              <li><a href="#">Jewellery</a></li>
              <li><a href="#">Fashion</a></li>
              <li><a href="#">Skincare</a></li>
              <li><a href="#">Homeware</a></li>
            </ul>
          </div>
          <div>
            <span className="eyebrow">Atelier</span>
            <ul>
              <li><a href="#">Our artisans</a></li>
              <li><a href="#">Sourcing</a></li>
              <li><a href="#">Journal</a></li>
            </ul>
          </div>
          <div>
            <span className="eyebrow">Help</span>
            <ul>
              <li><a href="#">Shipping</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-fine">
          <span>{storeName} Ltd · Registered in England · © 2026</span>
          <span>Lagos · London</span>
        </div>
      </div>
    </footer>
  );
}