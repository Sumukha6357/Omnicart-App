import { useMemo, useState } from "react";
import { Funnel, SlidersHorizontal, X } from "lucide-react";

const priceLabel = (min, max) => {
  if (!min && !max) return "";
  if (min && max) return `Rs. ${min} - Rs. ${max}`;
  if (min) return `Rs. ${min}+`;
  return `Up to Rs. ${max}`;
};

const SelectField = ({ label, value, onChange, children, className = "" }) => (
  <label className={`block ${className}`}>
    <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    <select
      value={value}
      onChange={onChange}
      className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/30"
    >
      {children}
    </select>
  </label>
);

const FilterContent = ({ filters, categories, onChange }) => (
  <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
    <SelectField label="Category" value={filters.category} onChange={(e) => onChange("category", e.target.value)}>
      <option value="">All Categories</option>
      {categories.map((c) => (
        <option key={c.id || c.name} value={c.name}>
          {c.name}
        </option>
      ))}
    </SelectField>

    <label>
      <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Min Price</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Rs.</span>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => onChange("minPrice", e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/30"
        />
      </div>
    </label>

    <label>
      <span className="mb-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">Max Price</span>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">Rs.</span>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => onChange("maxPrice", e.target.value)}
          className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/30"
        />
      </div>
    </label>

    <SelectField label="Rating" value={filters.minRating} onChange={(e) => onChange("minRating", e.target.value)}>
      <option value="">Any Rating</option>
      <option value="4">4+ stars</option>
      <option value="3">3+ stars</option>
      <option value="2">2+ stars</option>
      <option value="1">1+ stars</option>
    </SelectField>

    <SelectField label="Sort" value={filters.sort} onChange={(e) => onChange("sort", e.target.value)}>
      <option value="">Featured</option>
      <option value="newest">Newest</option>
      <option value="popular">Popular</option>
      <option value="rating">Top Rated</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </SelectField>
  </div>
);

const FilterBar = ({ filters, categories, onChange, onApply, onReset, categoriesLoading }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.category) chips.push({ key: "category", label: `Category: ${filters.category}` });
    const price = priceLabel(filters.minPrice, filters.maxPrice);
    if (price) chips.push({ key: "price", label: price });
    if (filters.minRating) chips.push({ key: "minRating", label: `${filters.minRating}+ stars` });
    if (filters.sort) chips.push({ key: "sort", label: `Sort: ${filters.sort.replace("_", " ")}` });
    return chips;
  }, [filters]);

  const clearFilter = (key) => {
    if (key === "price") {
      onChange("minPrice", "");
      onChange("maxPrice", "");
      return;
    }
    onChange(key, "");
  };

  return (
    <section className="sticky top-[70px] z-30 mb-6 rounded-card border border-slate-200 bg-white/95 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 md:top-[72px]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Filters</h2>
        <div className="flex items-center gap-2 md:hidden">
          <select
            value={filters.sort}
            onChange={(e) => onChange("sort", e.target.value)}
            aria-label="Sort products"
            className="h-10 w-[160px] rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500 dark:focus:ring-brand-500/30"
          >
            <option value="">Featured</option>
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <Funnel className="h-4 w-4" />
            Filters
          </button>
        </div>
      </div>

      {categoriesLoading ? (
        <div className="h-10 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      ) : (
        <div className="hidden md:block">
          <FilterContent filters={filters} categories={categories} onChange={onChange} />
        </div>
      )}

      <div className="mt-3 hidden items-center justify-between md:flex">
        <div className="flex flex-wrap gap-2">
          {activeFilterChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => clearFilter(chip.key)}
              className="inline-flex items-center gap-1 rounded-pill border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {chip.label}
              <X className="h-3.5 w-3.5" />
            </button>
          ))}
          {activeFilterChips.length > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white transition hover:bg-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Apply
          </button>
          <button
            type="button"
            onClick={onReset}
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Reset
          </button>
        </div>
      </div>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3 md:hidden" role="dialog" aria-modal="true">
          <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Filter Products</h3>
              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterContent filters={filters} categories={categories} onChange={onChange} />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setShowMobileFilters(false);
                }}
                className="h-10 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply();
                  setShowMobileFilters(false);
                }}
                className="h-10 rounded-lg bg-brand-600 text-sm font-semibold text-white"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FilterBar;
