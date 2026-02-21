const categoryTiles = [
  { label: "Beauty", category: "beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80" },
  { label: "Smartphones", category: "smartphones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80" },
  { label: "Furniture", category: "furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80" },
  { label: "Groceries", category: "groceries", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80" },
];

export default function CategoryBanners({ onPickCategory }) {
  return (
    <section aria-label="Shop by category" className="space-y-3">
      <div className="flex items-end justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Shop by Category</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Quick picks curated for everyday buys</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {categoryTiles.map((tile) => (
          <button
            key={tile.category}
            type="button"
            onClick={() => onPickCategory(tile.category)}
            className="group relative h-28 overflow-hidden rounded-xl border border-slate-200 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800"
          >
            <img
              src={tile.image}
              alt={tile.label}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-black/10" />
            <span className="absolute bottom-2 left-2 rounded-pill bg-white/90 px-2 py-1 text-xs font-semibold text-slate-800">
              {tile.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
