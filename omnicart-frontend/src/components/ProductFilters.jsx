import React from "react";

const ProductFilters = ({
  filters,
  categories,
  onChange,
  onApply,
  onReset,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
        Apply Filters
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <select
          value={filters.category}
          onChange={(e) => onChange("category", e.target.value)}
          className="border dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
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
          className="border dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
        />

        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", e.target.value)}
          className="border dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
        />

        <select
          value={filters.minRating}
          onChange={(e) => onChange("minRating", e.target.value)}
          className="border dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
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
          className="border dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-100"
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={onReset}
          className="bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-slate-100 px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-slate-700"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
