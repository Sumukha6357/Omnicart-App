import { Megaphone } from "lucide-react";

export default function PromoAdsStrip({ ads = [], onAdClick }) {
  if (!ads.length) return null;

  return (
    <section aria-label="Promoted deals" className="space-y-3">
      <div className="flex items-center gap-2">
        <Megaphone className="h-4 w-4 text-brand-600" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Featured Offers</h2>
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {ads.slice(0, 3).map((ad) => (
          <button
            key={ad.id}
            type="button"
            onClick={() => onAdClick(ad)}
            className="group relative h-40 overflow-hidden rounded-xl border border-slate-200 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800"
          >
            <img
              src={ad.imageUrl}
              alt={ad.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3">
              <p className="text-sm font-bold text-white">{ad.title}</p>
              {ad.subtitle && <p className="mt-0.5 text-xs text-slate-200">{ad.subtitle}</p>}
              <span className="mt-2 inline-flex rounded-pill bg-white px-2 py-1 text-xs font-semibold text-slate-800">
                {ad.ctaText || "Shop now"}
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
