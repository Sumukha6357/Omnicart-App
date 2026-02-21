import { useEffect, useMemo, useRef, useState } from "react";
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

const FilterDrawer = ({ filters, categories, onChange, onApply, onReset, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-end bg-black/40 p-3" role="dialog" aria-modal="true">
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:max-w-xl md:mx-auto md:my-auto">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Filter Products</h3>
        <button
          type="button"
          onClick={onClose}
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
            onClose();
          }}
          className="h-10 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => {
            onApply();
            onClose();
          }}
          className="h-10 rounded-lg bg-brand-600 text-sm font-semibold text-white"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
);

const FilterBar = ({ filters, categories, onChange, onApply, onReset, categoriesLoading, compact = false, resultCount }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.category) chips.push({ key: "category", label: `Category: ${filters.category}` });
    const price = priceLabel(filters.minPrice, filters.maxPrice);
    if (price) chips.push({ key: "price", label: price });
    if (filters.minRating) chips.push({ key: "minRating", label: `${filters.minRating}+ stars` });
    if (filters.sort) chips.push({ key: "sort", label: `Sort: ${filters.sort.replace("_", " ")}` });
    return chips;
  }, [filters]);

  useEffect(() => {
    if (!compact) return;
    const onScroll = () => {
      const y = window.scrollY;
      const scrollingDown = y > lastY.current;
      if (y < 120) setVisible(true);
      else if (scrollingDown && y > 220) setVisible(false);
      else if (!scrollingDown) setVisible(true);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [compact]);

  const clearFilter = (key) => {
    if (key === "price") {
      onChange("minPrice", "");
      onChange("maxPrice", "");
      return;
    }
    onChange(key, "");
  };

  if (compact) {
    return (
      <section
        className={`sticky top-[72px] z-30 mb-4 rounded-card border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900/95 ${
          visible ? "translate-y-0" : "-translate-y-24"
        }`}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {typeof resultCount === "number" ? `${resultCount} results` : "Filters"}
          </span>

          <select
            value={filters.sort}
            onChange={(e) => onChange("sort", e.target.value)}
            aria-label="Sort products"
            className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">Sort: Featured</option>
            <option value="newest">Newest</option>
            <option value="popular">Bestselling</option>
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => onChange("category", e.target.value)}
            aria-label="Category"
            className="h-9 max-w-[180px] rounded-lg border border-slate-300 bg-white px-2 text-xs font-semibold text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <Funnel className="h-3.5 w-3.5" />
            More
          </button>

          <button
            type="button"
            onClick={onApply}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-brand-600 px-2.5 text-xs font-semibold text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Apply
          </button>

          {activeFilterChips.length > 0 && (
            <button type="button" onClick={onReset} className="h-9 rounded-lg px-2 text-xs font-semibold text-brand-600">
              Clear
            </button>
          )}
        </div>

        {activeFilterChips.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {activeFilterChips.slice(0, 4).map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => clearFilter(chip.key)}
                className="inline-flex items-center gap-1 rounded-pill border border-slate-300 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
          </div>
        )}

        {showFilters && (
          <FilterDrawer
            filters={filters}
            categories={categories}
            onChange={onChange}
            onApply={onApply}
            onReset={onReset}
            onClose={() => setShowFilters(false)}
          />
        )}
      </section>
    );
  }

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
            onClick={() => setShowFilters(true)}
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
            <button type="button" onClick={onReset} className="inline-flex items-center gap-1 rounded-pill px-3 py-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
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

      {showFilters && (
        <FilterDrawer
          filters={filters}
          categories={categories}
          onChange={onChange}
          onApply={onApply}
          onReset={onReset}
          onClose={() => setShowFilters(false)}
        />
      )}
    </section>
  );
};

export default FilterBar;
