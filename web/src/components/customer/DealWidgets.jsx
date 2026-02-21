import { Link } from "react-router-dom";

const Widget = ({ title, items = [] }) => (
  <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
    <div className="grid grid-cols-2 gap-2">
      {items.slice(0, 4).map((item) => (
        <Link key={item.id} to={`/product/${item.id}`} className="group block">
          <img
            src={item.imageUrl || "/placeholder.jpg"}
            alt={item.name}
            loading="lazy"
            className="h-24 w-full rounded-lg bg-slate-100 object-cover transition group-hover:opacity-90 dark:bg-slate-950"
          />
          <p className="mt-1 line-clamp-2 text-xs font-medium text-slate-600 dark:text-slate-300">{item.name}</p>
        </Link>
      ))}
    </div>
  </article>
);

export default function DealWidgets({ products = [] }) {
  if (!products.length) return null;

  const widgets = [
    { key: "home", title: "Revamp your home in style", items: products.filter((p) => String(p.categoryName || "").includes("home")).slice(0, 4) },
    { key: "beauty", title: "Beauty specials this week", items: products.filter((p) => String(p.categoryName || "").includes("beauty")).slice(0, 4) },
    { key: "top", title: "Appliances and gadgets", items: [...products].sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0)).slice(0, 4) },
    { key: "budget", title: "Starting low, value high", items: [...products].sort((a, b) => Number(a.price || 0) - Number(b.price || 0)).slice(0, 4) },
  ];

  return (
    <section aria-label="Deal widgets" className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {widgets.map((widget) => (
        <Widget key={widget.key} title={widget.title} items={widget.items} />
      ))}
    </section>
  );
}
