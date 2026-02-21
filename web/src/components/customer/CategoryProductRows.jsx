import { Link } from "react-router-dom";
import { formatInr } from "../../utils/formatters";

const RowCard = ({ product }) => (
  <Link
    to={`/product/${product.id}`}
    className="min-w-[180px] max-w-[180px] rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
  >
    <img
      src={product.imageUrl || "/placeholder.jpg"}
      alt={product.name}
      loading="lazy"
      className="h-28 w-full rounded-lg bg-slate-100 object-cover dark:bg-slate-950"
    />
    <p className="mt-2 line-clamp-2 min-h-10 text-sm font-semibold text-slate-900 dark:text-slate-100">
      {product.name}
    </p>
    <p className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{formatInr(product.price)}</p>
  </Link>
);

export default function CategoryProductRows({ products = [], onCategoryPick }) {
  const byRating = [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 10);
  const budget = [...products].sort((a, b) => Number(a.price || 0) - Number(b.price || 0)).slice(0, 10);
  const popularBeauty = products
    .filter((p) => String(p.categoryName || "").toLowerCase().includes("beauty"))
    .slice(0, 10);

  const sections = [
    { key: "top", title: "Top rated picks for you", items: byRating, category: "" },
    { key: "budget", title: "Budget buys under trending range", items: budget, category: "" },
    { key: "beauty", title: "Beauty store spotlight", items: popularBeauty, category: "beauty" },
  ].filter((s) => s.items.length > 0);

  if (!sections.length) return null;

  return (
    <section className="space-y-4">
      {sections.map((section) => (
        <div key={section.key} className="rounded-card border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{section.title}</h2>
            {section.category ? (
              <button
                type="button"
                onClick={() => onCategoryPick(section.category)}
                className="text-sm font-semibold text-brand-600 hover:text-brand-700"
              >
                View all
              </button>
            ) : null}
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {section.items.map((product) => (
              <RowCard key={`${section.key}-${product.id}`} product={product} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
