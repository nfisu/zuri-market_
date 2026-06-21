export default function Hero({ tagline }) {
  return (
    <section className="hero">
      <span className="eyebrow">Lagos · London · est. 2022</span>
      <h1 className="hero-headline">
        Made by hand <em>in West Africa.</em><br />
        Delivered to your door <em>in Europe.</em>
      </h1>
      <p className="hero-lede">
        {tagline || 'Handcrafted African goods, delivered to Europe.'}
      </p>
      <div className="hero-meta">
        <span>16 artisans · 4 countries · 1 catalogue</span>
      </div>
    </section>
  );
}