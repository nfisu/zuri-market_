export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="category-filter" role="tablist" aria-label="Product categories">
      {categories.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={active === cat.id}
          className={`category-pill${active === cat.id ? ' active' : ''}`}
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}