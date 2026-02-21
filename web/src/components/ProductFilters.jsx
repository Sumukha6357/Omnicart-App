import React from "react";

const ProductFilters = ({
  filters,
  categories,
  onChange,
  onApply,
  onReset,
}) => {
  return (
    <div className="marketplace-panel mb-6 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">
        Apply Filters
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id || c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(e) => onChange("minPrice", e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
        />

        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
        />

        <select
          value={filters.minRating}
          onChange={(e) => onChange("minRating", e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
        >
          <option value="">Any Rating</option>
          <option value="4">4+ stars</option>
          <option value="3">3+ stars</option>
          <option value="2">2+ stars</option>
          <option value="1">1+ stars</option>
        </select>

        <select
          value={filters.sort}
          onChange={(e) => onChange("sort", e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800"
        >
          <option value="">Sort</option>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="rating">Top Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onApply}
          className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={onReset}
          className="rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
